import Dexie from 'dexie';

export const db = new Dexie('NoteNestDB');

// Define database schema history
db.version(1).stores({
  notes: '_id, id, title, isPinned, isFavorite, isDeleted, isArchived, updatedAt, syncStatus',
  folders: 'id, name',
  syncQueue: '++id, noteId, action, timestamp'
});

db.version(2).stores({
  notes: '_id, id, title, notebookId, sectionId, isPinned, isFavorite, isDeleted, isArchived, updatedAt, syncStatus',
  folders: 'id, name',
  notebooks: '_id, id, name, order, isDeleted',
  sections: '_id, id, notebookId, name, order, isDeleted',
  syncQueue: '++id, noteId, action, timestamp'
});

// Version 3: Full Local-First Architecture with Cloud Sync Metadata & Storage Preferences
db.version(3).stores({
  notes: '_id, id, title, notebookId, sectionId, isPinned, isFavorite, isDeleted, isArchived, updatedAt, lastSyncedAt, providerFileId, syncStatus',
  folders: 'id, name',
  notebooks: '_id, id, name, order, isDeleted, updatedAt, lastSyncedAt, providerFileId',
  sections: '_id, id, notebookId, name, order, isDeleted, updatedAt, lastSyncedAt, providerFileId',
  syncQueue: '++id, recordType, recordId, action, timestamp',
  storageMeta: 'key, value'
});

// Version 4: Note Version History Support
db.version(4).stores({
  notes: '_id, id, title, notebookId, sectionId, isPinned, isFavorite, isDeleted, isArchived, updatedAt, lastSyncedAt, providerFileId, syncStatus',
  folders: 'id, name',
  notebooks: '_id, id, name, order, isDeleted, updatedAt, lastSyncedAt, providerFileId',
  sections: '_id, id, notebookId, name, order, isDeleted, updatedAt, lastSyncedAt, providerFileId',
  syncQueue: '++id, recordType, recordId, action, timestamp',
  storageMeta: 'key, value',
  versions: '_id, id, noteId, userId, versionType, createdAt'
});

export const offlineService = {
  // Storage Meta helpers
  async getStorageMeta(key, defaultValue = null) {
    try {
      const record = await db.storageMeta.get(key);
      return record ? record.value : defaultValue;
    } catch (err) {
      console.warn('Dexie getStorageMeta error:', err);
      return defaultValue;
    }
  },

  async setStorageMeta(key, value) {
    try {
      await db.storageMeta.put({ key, value, updatedAt: new Date().toISOString() });
      return value;
    } catch (err) {
      console.warn('Dexie setStorageMeta error:', err);
      return null;
    }
  },

  async getAllStorageMeta() {
    try {
      const items = await db.storageMeta.toArray();
      const meta = {};
      items.forEach((item) => {
        meta[item.key] = item.value;
      });
      return meta;
    } catch (err) {
      console.warn('Dexie getAllStorageMeta error:', err);
      return {};
    }
  },

  // Get all cached notes from local Dexie database
  async getLocalNotes(params = {}) {
    try {
      let collection = db.notes.toCollection();

      if (params.filter === 'favorites') {
        collection = db.notes.filter((n) => !n.isDeleted && n.isFavorite);
      } else if (params.filter === 'trash') {
        collection = db.notes.filter((n) => n.isDeleted);
      } else if (params.filter === 'archived') {
        collection = db.notes.filter((n) => !n.isDeleted && n.isArchived);
      } else {
        collection = db.notes.filter((n) => !n.isDeleted && !n.isArchived);
      }

      const all = await collection.toArray();
      // Sort by isPinned descending, then updatedAt descending
      return all.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
    } catch (err) {
      console.warn('Dexie getLocalNotes error:', err);
      return [];
    }
  },

  // Save or update a note locally
  async saveLocalNote(noteData, isPendingSync = true) {
    try {
      const id = noteData._id || noteData.id || `local_note_${Date.now()}`;
      const record = {
        ...noteData,
        _id: id,
        id: id,
        updatedAt: noteData.updatedAt || new Date().toISOString(),
        syncStatus: isPendingSync ? 'pending' : 'synced'
      };

      await db.notes.put(record);

      if (isPendingSync) {
        await db.syncQueue.add({
          recordType: 'note',
          recordId: id,
          noteId: id, // backwards compatibility
          action: 'upsert',
          payload: record,
          timestamp: Date.now()
        });
      }

      return record;
    } catch (err) {
      console.warn('Dexie saveLocalNote error:', err);
      return noteData;
    }
  },

  // Bulk cache notes into local Dexie
  async cacheServerNotes(notes = []) {
    try {
      if (!Array.isArray(notes) || notes.length === 0) return;
      await db.notes.bulkPut(
        notes.map((n) => ({
          ...n,
          id: n._id || n.id,
          _id: n._id || n.id,
          syncStatus: n.syncStatus || 'synced'
        }))
      );
    } catch (err) {
      console.warn('Dexie cacheServerNotes error:', err);
    }
  },

  // Mark a note as deleted locally
  async deleteLocalNote(id, permanent = false) {
    try {
      if (permanent) {
        await db.notes.delete(id);
      } else {
        const note = await db.notes.get(id);
        if (note) {
          note.isDeleted = true;
          note.updatedAt = new Date().toISOString();
          note.syncStatus = 'pending';
          await db.notes.put(note);
        }
      }

      await db.syncQueue.add({
        recordType: 'note',
        recordId: id,
        noteId: id,
        action: permanent ? 'permanentDelete' : 'delete',
        payload: { id },
        timestamp: Date.now()
      });
    } catch (err) {
      console.warn('Dexie deleteLocalNote error:', err);
    }
  },

  // Restore a note locally
  async restoreLocalNote(id) {
    try {
      const note = await db.notes.get(id);
      if (note) {
        note.isDeleted = false;
        note.updatedAt = new Date().toISOString();
        note.syncStatus = 'pending';
        await db.notes.put(note);
      }

      await db.syncQueue.add({
        recordType: 'note',
        recordId: id,
        noteId: id,
        action: 'restore',
        payload: { id },
        timestamp: Date.now()
      });
    } catch (err) {
      console.warn('Dexie restoreLocalNote error:', err);
    }
  },

  // Empty local trash
  async emptyLocalTrash() {
    try {
      const trashNotes = await db.notes.filter((n) => Boolean(n.isDeleted)).toArray();
      const ids = trashNotes.map((n) => n._id || n.id).filter(Boolean);
      if (ids.length > 0) {
        await db.notes.bulkDelete(ids);
      }
    } catch (err) {
      console.warn('Dexie emptyLocalTrash error:', err);
    }
  },

  // Process sync queue for notes
  async processSyncQueue(apiClient) {
    if (!navigator.onLine) return { synced: 0, pending: await db.syncQueue.count() };

    try {
      const items = await db.syncQueue.toArray();
      if (items.length === 0) return { synced: 0, pending: 0 };

      let syncedCount = 0;
      for (const item of items) {
        try {
          if (item.action === 'upsert' && item.payload) {
            const recordId = item.payload._id || item.payload.id;
            if (recordId && !recordId.startsWith('local_')) {
              await apiClient.updateNote(recordId, item.payload);
            } else {
              const res = await apiClient.createNote(item.payload);
              if (res.data?._id) {
                await db.notes.delete(recordId);
                await db.notes.put({ ...res.data, syncStatus: 'synced' });
              }
            }
          } else if (item.action === 'delete') {
            await apiClient.deleteNote(item.recordId || item.noteId);
          } else if (item.action === 'restore') {
            await apiClient.restoreNote(item.recordId || item.noteId);
          } else if (item.action === 'permanentDelete') {
            await apiClient.permanentDeleteNote(item.recordId || item.noteId);
          }
          await db.syncQueue.delete(item.id);
          syncedCount++;
        } catch (itemErr) {
          console.warn('Sync queue item failed:', item.id, itemErr.message);
        }
      }

      return { synced: syncedCount, pending: await db.syncQueue.count() };
    } catch (err) {
      console.warn('processSyncQueue error:', err);
      return { synced: 0, pending: 0 };
    }
  },

  // Folders helpers
  async getLocalFolders() {
    try {
      return await db.folders.toArray();
    } catch (err) {
      console.warn('Dexie getLocalFolders error:', err);
      return [];
    }
  },

  async cacheServerFolders(folders = []) {
    try {
      if (!Array.isArray(folders) || folders.length === 0) return;
      await db.folders.bulkPut(
        folders.map((f) => ({
          ...f,
          id: f._id || f.id
        }))
      );
    } catch (err) {
      console.warn('Dexie cacheServerFolders error:', err);
    }
  },

  async saveLocalFolder(folderData) {
    try {
      const id = folderData._id || folderData.id || `folder_${Date.now()}`;
      const record = { ...folderData, _id: id, id };
      await db.folders.put(record);
      return record;
    } catch (err) {
      console.warn('Dexie saveLocalFolder error:', err);
      return folderData;
    }
  },

  async deleteLocalFolder(id, folderName) {
    try {
      if (id) {
        await db.folders.delete(id);
      }
      const allMatching = await db.folders.filter((f) =>
        (id && (f.id === id || f._id === id || f.parentId === id)) ||
        (folderName && f.name?.toLowerCase() === folderName?.toLowerCase())
      ).toArray();

      for (const f of allMatching) {
        if (f.id) await db.folders.delete(f.id);
        if (f._id) await db.folders.delete(f._id);
      }
    } catch (err) {
      console.warn('Dexie deleteLocalFolder error:', err);
    }
  },

  // Notebooks helpers
  async getLocalNotebooks() {
    try {
      const all = await db.notebooks.filter((nb) => !nb.isDeleted).toArray();
      return all.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.warn('Dexie getLocalNotebooks error:', err);
      return [];
    }
  },

  async cacheServerNotebooks(notebooks = []) {
    try {
      if (!Array.isArray(notebooks) || notebooks.length === 0) return;
      await db.notebooks.bulkPut(
        notebooks.map((nb) => ({
          ...nb,
          id: nb._id || nb.id,
          _id: nb._id || nb.id
        }))
      );
    } catch (err) {
      console.warn('Dexie cacheServerNotebooks error:', err);
    }
  },

  async saveLocalNotebook(notebookData, isPendingSync = true) {
    try {
      const id = notebookData._id || notebookData.id || `local_nb_${Date.now()}`;
      const record = {
        ...notebookData,
        _id: id,
        id,
        updatedAt: notebookData.updatedAt || new Date().toISOString()
      };
      await db.notebooks.put(record);

      if (isPendingSync) {
        await db.syncQueue.add({
          recordType: 'notebook',
          recordId: id,
          action: 'upsert',
          payload: record,
          timestamp: Date.now()
        });
      }

      return record;
    } catch (err) {
      console.warn('Dexie saveLocalNotebook error:', err);
      return notebookData;
    }
  },

  async deleteLocalNotebook(id, isPendingSync = true) {
    try {
      if (id) {
        const nb = await db.notebooks.get(id);
        if (nb) {
          nb.isDeleted = true;
          nb.updatedAt = new Date().toISOString();
          await db.notebooks.put(nb);
        } else {
          await db.notebooks.delete(id);
        }

        if (isPendingSync) {
          await db.syncQueue.add({
            recordType: 'notebook',
            recordId: id,
            action: 'delete',
            payload: { id },
            timestamp: Date.now()
          });
        }
      }
    } catch (err) {
      console.warn('Dexie deleteLocalNotebook error:', err);
    }
  },

  // Sections helpers
  async getLocalSections(notebookId) {
    try {
      if (!notebookId) return [];
      const all = await db.sections
        .filter((s) => !s.isDeleted && (s.notebookId === notebookId || s.notebookId?._id === notebookId))
        .toArray();
      return all.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (err) {
      console.warn('Dexie getLocalSections error:', err);
      return [];
    }
  },

  async cacheServerSections(sections = []) {
    try {
      if (!Array.isArray(sections) || sections.length === 0) return;
      await db.sections.bulkPut(
        sections.map((s) => ({
          ...s,
          id: s._id || s.id,
          _id: s._id || s.id
        }))
      );
    } catch (err) {
      console.warn('Dexie cacheServerSections error:', err);
    }
  },

  async saveLocalSection(sectionData, isPendingSync = true) {
    try {
      const id = sectionData._id || sectionData.id || `local_sec_${Date.now()}`;
      const record = {
        ...sectionData,
        _id: id,
        id,
        updatedAt: sectionData.updatedAt || new Date().toISOString()
      };
      await db.sections.put(record);

      if (isPendingSync) {
        await db.syncQueue.add({
          recordType: 'section',
          recordId: id,
          action: 'upsert',
          payload: record,
          timestamp: Date.now()
        });
      }

      return record;
    } catch (err) {
      console.warn('Dexie saveLocalSection error:', err);
      return sectionData;
    }
  },

  async deleteLocalSection(id, isPendingSync = true) {
    try {
      if (id) {
        const sec = await db.sections.get(id);
        if (sec) {
          sec.isDeleted = true;
          sec.updatedAt = new Date().toISOString();
          await db.sections.put(sec);
        } else {
          await db.sections.delete(id);
        }

        if (isPendingSync) {
          await db.syncQueue.add({
            recordType: 'section',
            recordId: id,
            action: 'delete',
            payload: { id },
            timestamp: Date.now()
          });
        }
      }
    } catch (err) {
      console.warn('Dexie deleteLocalSection error:', err);
    }
  },

  // Export full backup of local database
  async exportFullBackup() {
    try {
      const [notebooks, sections, notes, folders, storageMeta] = await Promise.all([
        db.notebooks.toArray(),
        db.sections.toArray(),
        db.notes.toArray(),
        db.folders.toArray(),
        db.storageMeta.toArray()
      ]);

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        appName: 'NoteNest',
        environment: 'Local-First Dexie Backup',
        data: {
          notebooks,
          sections,
          notes,
          folders,
          storageMeta
        }
      };

      return backup;
    } catch (err) {
      console.error('Dexie exportFullBackup error:', err);
      throw err;
    }
  },

  // Import full backup into local database
  async importFullBackup(backupObj) {
    try {
      if (!backupObj || !backupObj.data) {
        throw new Error('Invalid backup file format: missing data container.');
      }

      const { notebooks = [], sections = [], notes = [], folders = [] } = backupObj.data;

      if (notebooks.length > 0) {
        await db.notebooks.bulkPut(notebooks);
      }
      if (sections.length > 0) {
        await db.sections.bulkPut(sections);
      }
      if (notes.length > 0) {
        await db.notes.bulkPut(notes);
      }
      if (folders.length > 0) {
        await db.folders.bulkPut(folders);
      }

      return {
        importedNotebooks: notebooks.length,
        importedSections: sections.length,
        importedNotes: notes.length,
        importedFolders: folders.length
      };
    } catch (err) {
      console.error('Dexie importFullBackup error:', err);
      throw err;
    }
  },

  // Clear all local data (for reset or logout)
  async clearAllData() {
    try {
      await Promise.all([
        db.notes.clear(),
        db.folders.clear(),
        db.notebooks.clear(),
        db.sections.clear(),
        db.syncQueue.clear(),
        db.storageMeta.clear(),
        db.versions ? db.versions.clear() : Promise.resolve()
      ]);
    } catch (err) {
      console.warn('Dexie clearAllData error:', err);
    }
  },

  // Version History offline helpers
  async getLocalVersions(noteId) {
    try {
      if (!db.versions) return [];
      const all = await db.versions.filter((v) => v.noteId === noteId).toArray();
      return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.warn('Dexie getLocalVersions error:', err);
      return [];
    }
  },

  async saveLocalVersion(noteId, versionData) {
    try {
      if (!db.versions) return versionData;
      const id = versionData._id || versionData.id || `v_${Date.now()}`;
      const record = {
        ...versionData,
        _id: id,
        id,
        noteId,
        createdAt: versionData.createdAt || new Date().toISOString()
      };
      await db.versions.put(record);
      return record;
    } catch (err) {
      console.warn('Dexie saveLocalVersion error:', err);
      return versionData;
    }
  },

  async cacheServerVersions(noteId, versions = []) {
    try {
      if (!db.versions || !Array.isArray(versions) || versions.length === 0) return;
      await db.versions.bulkPut(
        versions.map((v) => ({
          ...v,
          id: v._id || v.id,
          _id: v._id || v.id,
          noteId
        }))
      );
    } catch (err) {
      console.warn('Dexie cacheServerVersions error:', err);
    }
  }
};


