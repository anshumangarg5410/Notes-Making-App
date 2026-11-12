import api from './api';
import { db, offlineService } from './db';

export const versionService = {
  /**
   * Get all revision history versions for a note
   */
  async getVersions(noteId, params = {}) {
    if (!noteId) return { versions: [], pagination: {} };

    // 1. If online, fetch from backend
    if (navigator.onLine && String(noteId).length === 24 && !String(noteId).includes('-')) {
      try {
        const response = await api.get(`/notes/${noteId}/versions`, { params });
        if (response.data?.success && Array.isArray(response.data.data)) {
          // Cache to Dexie
          await offlineService.cacheServerVersions(noteId, response.data.data);
          return response.data;
        }
      } catch (err) {
        console.warn('Backend getVersions failed, falling back to local cache:', err.message);
      }
    }

    // 2. Fallback to Dexie local versions
    const local = await offlineService.getLocalVersions(noteId);
    return {
      success: true,
      data: local,
      pagination: { total: local.length, page: 1, limit: 50, pages: 1 }
    };
  },

  /**
   * Create a manual version snapshot of the note
   */
  async createManualVersion(noteId, payload = {}) {
    if (!noteId) throw new Error('Note ID is required');

    // 1. If online and valid server note, save to backend
    if (navigator.onLine && String(noteId).length === 24 && !String(noteId).includes('-')) {
      const response = await api.post(`/notes/${noteId}/versions`, payload);
      if (response.data?.data) {
        await offlineService.saveLocalVersion(noteId, response.data.data);
      }
      return response.data;
    }

    // 2. Otherwise create locally in Dexie
    const localVersion = await offlineService.saveLocalVersion(noteId, {
      ...payload,
      versionType: 'manual',
      createdAt: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Version snapshot saved locally',
      data: localVersion
    };
  },

  /**
   * Get a specific historical version
   */
  async getVersion(noteId, versionId) {
    if (navigator.onLine && String(noteId).length === 24 && !String(noteId).includes('-')) {
      try {
        const response = await api.get(`/notes/${noteId}/versions/${versionId}`);
        return response.data;
      } catch (err) {
        console.warn('Backend getVersion failed:', err.message);
      }
    }

    const local = await db.versions?.get(versionId);
    if (local) {
      return { success: true, data: local };
    }

    throw new Error('Historical version not found');
  },

  /**
   * Restore a historical version
   */
  async restoreVersion(noteId, versionId) {
    if (!noteId || !versionId) throw new Error('Note ID and Version ID are required');

    if (navigator.onLine && String(noteId).length === 24 && !String(noteId).includes('-')) {
      const response = await api.post(`/notes/${noteId}/versions/${versionId}/restore`);
      return response.data;
    }

    // Offline restoration fallback
    const targetVersion = await db.versions?.get(versionId);
    if (!targetVersion) throw new Error('Historical version not found locally');

    const note = await db.notes.get(noteId);
    if (!note) throw new Error('Active note not found locally');

    // Create pre-restore local version
    await offlineService.saveLocalVersion(noteId, {
      ...note,
      versionType: 'pre-restore',
      versionName: `Pre-restore snapshot before restoring ${new Date(targetVersion.createdAt).toLocaleDateString()}`
    });

    // Overwrite local note
    const restored = {
      ...note,
      title: targetVersion.title,
      content: targetVersion.content,
      plainText: targetVersion.plainText,
      tags: targetVersion.tags,
      drawings: targetVersion.drawings,
      wordCount: targetVersion.wordCount,
      charCount: targetVersion.charCount,
      updatedAt: new Date().toISOString(),
      syncStatus: 'pending'
    };
    await db.notes.put(restored);

    return {
      success: true,
      message: 'Restored historical version locally',
      data: { note: restored, restoredFromVersion: targetVersion }
    };
  }
};

export default versionService;
