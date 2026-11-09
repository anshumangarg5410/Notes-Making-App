const Note = require('../models/Note');
const Folder = require('../models/Folder');
const { logActivity } = require('../utils/activityLogger');

class SyncService {
  /**
   * Process pushed client mutations
   */
  async processPush(userId, { mutations = [] }) {
    const idMappings = {};
    const conflicts = [];
    let processedCount = 0;

    for (const mutation of mutations) {
      const { clientMutationId, action, entityType = 'note', noteId, payload = {}, revision = 1 } = mutation;
      const targetId = payload._id || payload.id || noteId;

      try {
        if (entityType === 'note') {
          if (action === 'upsert' || action === 'create') {
            const isLocalId = !targetId || targetId.toString().startsWith('local_') || targetId.length < 12;

            if (isLocalId) {
              // Create note on server
              const newNote = await Note.create({
                userId,
                title: payload.title?.trim() || 'Untitled Note',
                content: payload.content || '',
                plainText: payload.plainText || '',
                tags: Array.isArray(payload.tags) ? payload.tags : [],
                folderId: payload.folderId || null,
                folder: payload.folder || '',
                color: payload.color || 'default',
                icon: payload.icon || 'document',
                isPinned: Boolean(payload.isPinned),
                isFavorite: Boolean(payload.isFavorite),
                revision: 1,
                clientCreatedAt: payload.createdAt ? new Date(payload.createdAt) : new Date(),
                clientUpdatedAt: payload.updatedAt ? new Date(payload.updatedAt) : new Date()
              });

              idMappings[targetId] = newNote._id.toString();
              processedCount++;

              logActivity({
                userId,
                action: 'created_note',
                entityType: 'note',
                entityId: newNote._id,
                entityTitle: newNote.title,
                metadata: { synced: true }
              });
            } else {
              // Existing server note
              const existing = await Note.findOne({ _id: targetId, userId });
              if (existing) {
                // Conflict detection: if server revision is strictly ahead of client revision
                if (existing.revision > revision) {
                  // Conflict: create a safe conflicted copy so no data is overwritten
                  const conflictCopy = await Note.create({
                    userId,
                    title: `${payload.title || existing.title} (Conflicted Copy)`,
                    content: payload.content || existing.content,
                    plainText: payload.plainText || existing.plainText,
                    tags: payload.tags || existing.tags,
                    folder: existing.folder,
                    folderId: existing.folderId,
                    revision: 1
                  });

                  conflicts.push({
                    clientMutationId,
                    originalServerId: existing._id.toString(),
                    conflictCopyId: conflictCopy._id.toString(),
                    serverRevision: existing.revision,
                    clientRevision: revision,
                    message: 'Server had a newer version. A conflicted copy was created to preserve both edits.'
                  });
                } else {
                  // Safe to apply update
                  existing.title = payload.title !== undefined ? payload.title : existing.title;
                  existing.content = payload.content !== undefined ? payload.content : existing.content;
                  existing.plainText = payload.plainText !== undefined ? payload.plainText : existing.plainText;
                  existing.tags = Array.isArray(payload.tags) ? payload.tags : existing.tags;
                  if (payload.folderId !== undefined) existing.folderId = payload.folderId;
                  if (payload.folder !== undefined) existing.folder = payload.folder;
                  if (payload.isFavorite !== undefined) existing.isFavorite = Boolean(payload.isFavorite);
                  if (payload.isPinned !== undefined) existing.isPinned = Boolean(payload.isPinned);
                  if (payload.color !== undefined) existing.color = payload.color;
                  existing.revision += 1;
                  existing.clientUpdatedAt = new Date();

                  await existing.save();
                  processedCount++;
                }
              }
            }
          } else if (action === 'delete') {
            // Soft delete
            if (targetId && !targetId.toString().startsWith('local_')) {
              await Note.findOneAndUpdate(
                { _id: targetId, userId },
                { $set: { isDeleted: true, deletedAt: new Date() } }
              );
              processedCount++;
            }
          } else if (action === 'permanentDelete') {
            if (targetId && !targetId.toString().startsWith('local_')) {
              await Note.findOneAndDelete({ _id: targetId, userId });
              processedCount++;
            }
          }
        }
      } catch (err) {
        console.warn('[Sync Push Mutation Error]:', err.message);
      }
    }

    return {
      success: true,
      processedCount,
      idMappings,
      conflicts,
      serverTimestamp: new Date().toISOString()
    };
  }

  /**
   * Pull server changes since client's last sync timestamp
   */
  async processPull(userId, { lastSyncTimestamp = null }) {
    const query = { userId };

    if (lastSyncTimestamp) {
      const date = new Date(lastSyncTimestamp);
      query.$or = [
        { updatedAt: { $gte: date } },
        { deletedAt: { $gte: date } }
      ];
    }

    const [notes, folders] = await Promise.all([
      Note.find(query).lean(),
      Folder.find(query).lean()
    ]);

    return {
      success: true,
      serverTimestamp: new Date().toISOString(),
      notes: notes.map((n) => ({
        ...n,
        id: n._id.toString()
      })),
      folders: folders.map((f) => ({
        ...f,
        id: f._id.toString()
      }))
    };
  }

  /**
   * Get sync status and counts
   */
  async getStatus(userId) {
    const [totalNotes, totalFolders] = await Promise.all([
      Note.countDocuments({ userId, isDeleted: false }),
      Folder.countDocuments({ userId, isDeleted: false })
    ]);

    return {
      synced: true,
      serverTime: new Date().toISOString(),
      totalNotes,
      totalFolders
    };
  }
}

module.exports = new SyncService();
