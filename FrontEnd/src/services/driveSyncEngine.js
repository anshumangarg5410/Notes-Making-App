import { db, offlineService } from './db';
import storageService from './storageService';
import { isDriveFlagDisabledInEnv } from './integrationStatus';

class DriveSyncEngine {
  constructor() {
    this.isSyncing = false;
    this.pendingResync = false;
    this.subscribers = new Set();
    this.timer = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.triggerAutoSync();
      });
    }
  }

  /**
   * Subscribe to sync state changes
   * @param {Function} callback
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify(event) {
    this.subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.warn('Sync subscriber error:', err);
      }
    });
  }

  /**
   * Check if sync is enabled (Google Drive flag enabled, user opted in, AND Drive is connected)
   */
  async isGoogleDriveEnabled() {
    try {
      if (isDriveFlagDisabledInEnv()) return false;
      const [provider, driveConnected] = await Promise.all([
        offlineService.getStorageMeta('storage_provider'),
        offlineService.getStorageMeta('drive_connected')
      ]);
      return provider === 'google-drive' && driveConnected === true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Trigger automatic background sync if conditions are met
   */
  async triggerAutoSync() {
    if (!navigator.onLine) return;
    if (this.isSyncing) {
      this.pendingResync = true;
      return;
    }
    const isDrive = await this.isGoogleDriveEnabled();
    if (!isDrive) return;

    const pendingCount = await db.syncQueue.count();
    if (pendingCount > 0) {
      this.syncNow();
    }
  }

  /**
   * Run full or incremental synchronization with Google Drive
   */
  async syncNow() {
    if (this.isSyncing) {
      return { success: false, message: 'Sync already in progress' };
    }

    if (!navigator.onLine) {
      return { success: false, message: 'Device is offline. Changes stored in local IndexedDB.' };
    }

    this.isSyncing = true;
    this.notify({ type: 'sync_start', timestamp: new Date().toISOString() });

    try {
      // 1. Gather all local data from IndexedDB
      const [notebooks, sections, notes, queuedItems] = await Promise.all([
        db.notebooks.toArray(),
        db.sections.toArray(),
        db.notes.toArray(),
        db.syncQueue.toArray()
      ]);

      const deletedIds = queuedItems
        .filter((item) => item.action === 'delete')
        .map((item) => item.recordId || item.noteId)
        .filter(Boolean);

      const permanentDeletedIds = queuedItems
        .filter((item) => item.action === 'permanentDelete')
        .map((item) => item.recordId || item.noteId)
        .filter(Boolean);

      // 2. Transmit batch to backend Google Drive service
      const payload = {
        notebooks: notebooks.map((nb) => ({
          _id: nb._id || nb.id,
          name: nb.name,
          icon: nb.icon || 'BookOpen',
          color: nb.color || '#3b82f6',
          order: nb.order || 0,
          isDeleted: Boolean(nb.isDeleted),
          updatedAt: nb.updatedAt || new Date().toISOString()
        })),
        sections: sections.map((sec) => ({
          _id: sec._id || sec.id,
          notebookId: sec.notebookId?._id || sec.notebookId,
          name: sec.name,
          icon: sec.icon || 'Folder',
          order: sec.order || 0,
          isDeleted: Boolean(sec.isDeleted),
          updatedAt: sec.updatedAt || new Date().toISOString()
        })),
        notes: notes.map((note) => ({
          _id: note._id || note.id,
          title: note.title || 'Untitled',
          notebookId: note.notebookId?._id || note.notebookId || null,
          sectionId: note.sectionId?._id || note.sectionId || null,
          content: note.content || '',
          plainText: note.plainText || '',
          tags: Array.isArray(note.tags) ? note.tags : [],
          isPinned: Boolean(note.isPinned),
          isFavorite: Boolean(note.isFavorite),
          isDeleted: Boolean(note.isDeleted),
          canvasData: note.canvasData || null,
          updatedAt: note.updatedAt || new Date().toISOString()
        })),
        deletedIds,
        permanentDeletedIds
      };

      const res = await storageService.syncGoogleDrive(payload);

      if (res.success) {
        const syncTimestamp = new Date().toISOString();
        await offlineService.setStorageMeta('last_synced_at', syncTimestamp);
        await offlineService.setStorageMeta('last_sync_status', 'synced');

        // Clean out only the queued items that were processed in this batch
        const processedIds = queuedItems.map((item) => item.id).filter(Boolean);
        if (processedIds.length > 0) {
          await db.syncQueue.bulkDelete(processedIds);
        }

        // Mark local notes as synced
        await db.notes
          .toCollection()
          .modify({ syncStatus: 'synced', lastSyncedAt: syncTimestamp });

        this.notify({
          type: 'sync_success',
          timestamp: syncTimestamp,
          data: res.data
        });

        return {
          success: true,
          timestamp: syncTimestamp,
          syncedCount: (payload.notes?.length || 0) + (payload.notebooks?.length || 0)
        };
      } else {
        throw new Error(res.message || 'Sync failed');
      }
    } catch (err) {
      console.warn('[DriveSyncEngine] sync error:', err.message);
      this.notify({
        type: 'sync_error',
        error: err.message,
        timestamp: new Date().toISOString()
      });
      return { success: false, error: err.message };
    } finally {
      this.isSyncing = false;
      if (this.pendingResync) {
        this.pendingResync = false;
        this.triggerAutoSync();
      }
    }
  }

  /**
   * Start periodic timer to check for un-synced items
   */
  startAutoSync(intervalMs = 60000) {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.triggerAutoSync();
    }, intervalMs);
  }

  stopAutoSync() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const driveSyncEngine = new DriveSyncEngine();
export default driveSyncEngine;

