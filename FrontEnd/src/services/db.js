import Dexie from 'dexie';

export const db = new Dexie('NoteNestDB');

// Define database schema
db.version(1).stores({
  notes: '_id, id, title, isPinned, isFavorite, isDeleted, isArchived, updatedAt, syncStatus',
  folders: 'id, name',
  syncQueue: '++id, noteId, action, timestamp'
});

export const offlineService = {
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
      const id = noteData._id || noteData.id || `local_${Date.now()}`;
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
          noteId: id,
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

  // Bulk cache server notes into local Dexie
  async cacheServerNotes(notes = []) {
    try {
      if (!Array.isArray(notes) || notes.length === 0) return;
      await db.notes.bulkPut(
        notes.map((n) => ({
          ...n,
          id: n._id,
          syncStatus: 'synced'
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

  // Sync queued changes with backend
  async processSyncQueue(apiClient) {
    if (!navigator.onLine) return { synced: 0, pending: await db.syncQueue.count() };

    try {
      const items = await db.syncQueue.toArray();
      if (items.length === 0) return { synced: 0, pending: 0 };

      let syncedCount = 0;
      for (const item of items) {
        try {
          if (item.action === 'upsert') {
            if (item.payload._id && !item.payload._id.startsWith('local_')) {
              await apiClient.updateNote(item.payload._id, item.payload);
            } else {
              const res = await apiClient.createNote(item.payload);
              if (res.data?._id) {
                await db.notes.delete(item.payload._id);
                await db.notes.put({ ...res.data, syncStatus: 'synced' });
              }
            }
          } else if (item.action === 'delete') {
            await apiClient.deleteNote(item.noteId);
          } else if (item.action === 'restore') {
            await apiClient.restoreNote(item.noteId);
          } else if (item.action === 'permanentDelete') {
            await apiClient.permanentDeleteNote(item.noteId);
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

  // Folder offline caching helpers
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
  }
};

