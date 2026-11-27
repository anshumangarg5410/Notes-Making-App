const mongoose = require('mongoose');
const StoragePreference = require('../models/StoragePreference');
const DriveFileMapping = require('../models/DriveFileMapping');
const Note = require('../models/Note');
const Notebook = require('../models/Notebook');
const Section = require('../models/Section');
const googleDriveService = require('./googleDrive.service');
const environment = require('../config/environment');

class StorageService {
  /**
   * Strips HTML tags and decodes entities into clean readable plain text
   * @param {string} html
   * @returns {string}
   */
  stripHtmlToText(html) {
    if (!html || typeof html !== 'string') return '';
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h1|h2|h3|h4|h5|h6|li|tr|div|blockquote)>/gi, '\n')
      .replace(/<hr\s*\/?>/gi, '\n----------------------------------------\n')
      .replace(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi, '[Image: $1]')
      .replace(/<img[^>]*>/gi, '[Image]')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  /**
   * Generates a clean, safe filename ending with .txt for Google Drive storage
   * @param {Object} note
   * @param {string} [fallbackId]
   * @returns {string}
   */
  formatNoteFileName(note, fallbackId = '') {
    let title = (note?.title || '').trim();
    if (!title) {
      title = fallbackId ? `Note-${fallbackId.slice(-6)}` : 'Untitled Note';
    }
    // Sanitize illegal filesystem / Google Drive characters
    const safe = title.replace(/[\\/:*?"<>|\r\n\t]/g, '').trim() || 'Untitled Note';
    const base = safe.replace(/\.txt$/i, '').trim();
    return `${base || 'Untitled Note'}.txt`;
  }

  /**
   * Formats a note object into clean, human-readable plain text (.txt format)
   * @param {Object} note
   * @param {string} noteId
   * @returns {string}
   */
  formatNoteToText(note, noteId) {
    const title = (note?.title || 'Untitled Note').trim();
    const notebook = note?.notebook || '';
    const section = note?.section || '';
    const tags = Array.isArray(note?.tags)
      ? note.tags.filter(Boolean).join(', ')
      : (note?.tags || '');
    const updatedAt = note?.updatedAt
      ? new Date(note.updatedAt).toISOString()
      : new Date().toISOString();

    // Extract clean plain text body
    let body = '';
    if (note?.plainText && !note.plainText.includes('<p>') && !note.plainText.includes('<div>')) {
      body = note.plainText.trim();
    } else if (note?.content) {
      body = this.stripHtmlToText(note.content);
    } else if (note?.plainText) {
      body = this.stripHtmlToText(note.plainText);
    }

    if (Array.isArray(note?.drawings) && note.drawings.length > 0) {
      const strokeCount = note.drawings.reduce((sum, d) => sum + (d?.strokes?.length || 0), 0);
      if (strokeCount > 0) {
        body += `\n\n[NoteNest Drawing: ${note.drawings.length} sketch(es), ${strokeCount} strokes]`;
      }
    }

    // Build structured human-readable text document
    const headerLines = [
      title,
      '='.repeat(Math.max(title.length, 20)),
      notebook ? `Notebook: ${notebook}` : null,
      section ? `Section: ${section}` : null,
      tags ? `Tags: ${tags}` : null,
      `Last Updated: ${updatedAt}`,
      `Note ID: ${noteId}`,
      '----------------------------------------',
      ''
    ].filter((line) => line !== null);

    return `${headerLines.join('\n')}\n${body}\n`;
  }

  /**
   * Immediately trashes or permanently deletes a note file from Google Drive
   * @param {string} userId
   * @param {string} noteId
   * @param {boolean} [permanent=false]
   */
  async trashOrDeleteNoteFromDrive(userId, noteId, permanent = false) {
    try {
      if (!environment.googleDrive?.enabled) return false;
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(noteId)) return false;
      const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
      if (
        !pref ||
        pref.provider !== 'google-drive' ||
        !pref.googleDrive?.connected ||
        !pref.googleDrive.refreshTokenEncrypted
      ) {
        return false;
      }

      const mapping = await DriveFileMapping.findOne({
        userId,
        recordType: 'note',
        recordId: noteId.toString()
      });
      if (!mapping || !mapping.driveFileId) return false;

      const { accessToken } = await googleDriveService.getAccessToken(pref.googleDrive.refreshTokenEncrypted);
      if (permanent) {
        await googleDriveService.deleteFile(accessToken, mapping.driveFileId);
        await DriveFileMapping.deleteOne({ _id: mapping._id });
      } else {
        await googleDriveService.trashFile(accessToken, mapping.driveFileId);
        mapping.isDeleted = true;
        await mapping.save();
      }
      return true;
    } catch (err) {
      console.warn(`[StorageService] Failed to trash/delete note ${noteId} from Google Drive:`, err.message);
      return false;
    }
  }

  /**
   * Retrieves or initializes storage preferences for a user
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getPreferences(userId) {
    let pref = await StoragePreference.findOne({ userId });

    if (!pref) {
      // Check if user already has data in MongoDB
      const existingNoteCount = await Note.countDocuments({ userId, isDeleted: false });
      const existingNotebookCount = await Notebook.countDocuments({ userId, isDeleted: false });

      pref = await StoragePreference.create({
        userId,
        provider: 'local',
        onboardingCompleted: false,
        stats: {
          localRecordsCount: existingNoteCount,
          cloudRecordsCount: 0,
          pendingSyncCount: 0
        }
      });
    }

    // Check count of existing MongoDB notes to assist with onboarding migration
    const mongoNotesCount = await Note.countDocuments({ userId, isDeleted: false });
    const mongoNotebooksCount = await Notebook.countDocuments({ userId, isDeleted: false });
    const mongoSectionsCount = await Section.countDocuments({ userId, isDeleted: false });

    return {
      ...pref.toJSON(),
      googleDriveEnabled: Boolean(
        environment.googleDrive?.enabled &&
          environment.googleDrive?.clientId &&
          environment.googleDrive?.clientSecret
      ),
      existingMongoData: {
        hasData: mongoNotesCount > 0 || mongoNotebooksCount > 0,
        notesCount: mongoNotesCount,
        notebooksCount: mongoNotebooksCount,
        sectionsCount: mongoSectionsCount
      }
    };
  }

  /**
   * Records a failed Google Drive connection attempt without activating Drive
   * @param {string} userId
   */
  async markConnectionFailed(userId) {
    const existing = await StoragePreference.findOne({ userId });
    if (existing?.googleDrive?.connected) {
      return existing;
    }
    return StoragePreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          provider: 'local',
          driveStatus: 'connection_failed',
          'googleDrive.connected': false,
          'googleDrive.lastSyncStatus': 'error',
          'googleDrive.lastSyncError': 'Google Drive is temporarily unavailable'
        }
      },
      { new: true, upsert: true }
    );
  }

  /**
   * Updates storage preferences (provider, onboarding status, driveStatus)
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updatePreferences(userId, updateData) {
    const allowed = {};
    if (updateData.provider && ['local', 'google-drive'].includes(updateData.provider)) {
      allowed.provider = updateData.provider;
    }
    if (typeof updateData.onboardingCompleted === 'boolean') {
      allowed.onboardingCompleted = updateData.onboardingCompleted;
    }
    if (
      updateData.driveStatus &&
      ['not_configured', 'declined', 'connection_failed', 'connected', 'disconnected'].includes(
        updateData.driveStatus
      )
    ) {
      allowed.driveStatus = updateData.driveStatus;
    } else if (updateData.provider === 'local' && updateData.onboardingCompleted === true) {
      allowed.driveStatus = 'declined';
    }

    const pref = await StoragePreference.findOneAndUpdate(
      { userId },
      { $set: allowed },
      { new: true, upsert: true }
    );

    return pref;
  }

  /**
   * Gets Google Drive connection status for user (lazy: never calls Google APIs unless Drive is enabled & connected)
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getGoogleDriveStatus(userId) {
    const googleDriveEnabled = Boolean(
      environment.googleDrive?.enabled &&
        environment.googleDrive?.clientId &&
        environment.googleDrive?.clientSecret
    );
    const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
    if (!pref || !pref.googleDrive?.connected) {
      return {
        connected: false,
        googleDriveEnabled,
        provider: pref?.provider || 'local',
        driveStatus: pref?.driveStatus || 'not_configured',
        email: '',
        lastSyncedAt: null,
        rootFolderId: null,
        onboardingCompleted: pref?.onboardingCompleted || false
      };
    }

    // Only validate/refresh token when Google Drive is globally enabled AND actively selected by the user
    let tokenValid = googleDriveEnabled && pref.provider === 'google-drive';
    if (googleDriveEnabled && pref.provider === 'google-drive') {
      try {
        if (pref.googleDrive.refreshTokenEncrypted) {
          await googleDriveService.getAccessToken(pref.googleDrive.refreshTokenEncrypted);
        } else {
          tokenValid = false;
        }
      } catch (err) {
        if (err.code === 'DRIVE_TOKEN_EXPIRED') {
          tokenValid = false;
        }
      }
    }

    return {
      connected: pref.googleDrive.connected,
      googleDriveEnabled,
      provider: pref.provider,
      driveStatus: pref.driveStatus || 'connected',
      email: pref.googleDrive.email || '',
      tokenValid,
      rootFolderId: pref.googleDrive.rootFolderId || null,
      lastSyncedAt: pref.googleDrive.lastSyncedAt || null,
      lastSyncStatus: pref.googleDrive.lastSyncStatus || 'idle',
      lastSyncError: pref.googleDrive.lastSyncError || '',
      onboardingCompleted: pref.onboardingCompleted
    };
  }

  /**
   * Handles Google OAuth completion, saves encrypted refresh token, creates Drive folder structure
   * @param {string} userId
   * @param {string} refreshTokenEncrypted
   * @param {string} email
   */
  async connectGoogleDrive(userId, refreshTokenEncrypted, email) {
    if (!refreshTokenEncrypted) {
      throw new Error('No refresh token received from Google. If re-authorizing, please grant consent.');
    }

    // 1. Ensure folder structure on user's Google Drive
    const folders = await googleDriveService.ensureAppFolderStructure(refreshTokenEncrypted);

    // 2. Update StoragePreference record in MongoDB
    const pref = await StoragePreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          provider: 'google-drive',
          driveStatus: 'connected',
          onboardingCompleted: true,
          'googleDrive.connected': true,
          'googleDrive.email': email,
          'googleDrive.refreshTokenEncrypted': refreshTokenEncrypted,
          'googleDrive.rootFolderId': folders.rootFolderId,
          'googleDrive.notebooksFolderId': folders.notebooksFolderId,
          'googleDrive.sectionsFolderId': folders.sectionsFolderId,
          'googleDrive.notesFolderId': folders.notesFolderId,
          'googleDrive.attachmentsFolderId': folders.attachmentsFolderId,
          'googleDrive.lastSyncStatus': 'idle',
          'googleDrive.lastSyncError': ''
        }
      },
      { new: true, upsert: true }
    );

    return pref;
  }

  /**
   * Disconnects Google Drive from user account
   * @param {string} userId
   */
  async disconnectGoogleDrive(userId) {
    const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
    if (environment.googleDrive?.enabled && pref && pref.googleDrive?.refreshTokenEncrypted) {
      await googleDriveService.revokeToken(pref.googleDrive.refreshTokenEncrypted);
    }

    await StoragePreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          provider: 'local',
          driveStatus: 'disconnected',
          'googleDrive.connected': false,
          'googleDrive.refreshTokenEncrypted': '',
          'googleDrive.lastSyncStatus': 'idle'
        }
      }
    );

    return { success: true, message: 'Google Drive disconnected successfully' };
  }

  /**
   * Safe migration of existing user data in MongoDB for local IndexedDB seeding
   * @param {string} userId
   * @returns {Promise<Object>} Complete dataset
   */
  async getMigrationData(userId) {
    const notebooks = await Notebook.find({ userId, isDeleted: false }).sort({ order: 1 });
    const sections = await Section.find({ userId, isDeleted: false }).sort({ order: 1 });
    const notes = await Note.find({ userId, isDeleted: false }).sort({ updatedAt: -1 });

    return {
      notebooks,
      sections,
      notes,
      totalCount: notebooks.length + sections.length + notes.length
    };
  }

  /**
   * Synchronizes data between NoteNest and Google Drive
   * @param {string} userId
   * @param {Object} payload
   * @param {Array} [payload.changes] Array of modified records { recordType, recordId, data, action }
   * @param {boolean} [payload.fullSync=false] Whether to perform initial/full synchronization
   * @returns {Promise<Object>}
   */
  async syncWithGoogleDrive(userId, payload = {}) {
    if (!environment.googleDrive?.enabled) {
      const err = new Error('Google Drive integration is temporarily unavailable.');
      err.statusCode = 503;
      err.code = 'GOOGLE_DRIVE_DISABLED';
      throw err;
    }

    const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
    if (
      !pref ||
      pref.provider !== 'google-drive' ||
      !pref.googleDrive?.connected ||
      !pref.googleDrive.refreshTokenEncrypted
    ) {
      const err = new Error('Google Drive is not connected. Cannot synchronize.');
      err.statusCode = 400;
      throw err;
    }

    // 1. Get access token & ensure folders
    const { accessToken } = await googleDriveService.getAccessToken(pref.googleDrive.refreshTokenEncrypted);
    const folders = await googleDriveService.ensureAppFolderStructure(
      pref.googleDrive.refreshTokenEncrypted,
      pref.googleDrive
    );

    let syncedCount = 0;
    const errors = [];

    // Mark syncing status
    pref.googleDrive.lastSyncStatus = 'syncing';
    await pref.save();

    try {
      // Process explicit deletions from sync payload
      const permanentDeletedIds = Array.isArray(payload.permanentDeletedIds)
        ? payload.permanentDeletedIds.map((id) => id.toString())
        : [];
      const deletedIds = (Array.isArray(payload.deletedIds) ? payload.deletedIds : [])
        .concat(Array.isArray(payload.deletedNoteIds) ? payload.deletedNoteIds : [])
        .map((id) => id.toString());

      for (const permId of permanentDeletedIds) {
        try {
          const mapping = await DriveFileMapping.findOne({ userId, recordId: permId });
          if (mapping && mapping.driveFileId) {
            await googleDriveService.deleteFile(accessToken, mapping.driveFileId);
            await DriveFileMapping.deleteOne({ _id: mapping._id });
            syncedCount++;
          }
        } catch (delErr) {
          errors.push({ recordId: permId, error: delErr.message });
        }
      }

      for (const recIdStr of deletedIds) {
        if (permanentDeletedIds.includes(recIdStr)) continue;
        try {
          const mapping = await DriveFileMapping.findOne({ userId, recordId: recIdStr });
          if (mapping && mapping.driveFileId && !mapping.isDeleted) {
            await googleDriveService.trashFile(accessToken, mapping.driveFileId);
            mapping.isDeleted = true;
            await mapping.save();
            syncedCount++;
          }
        } catch (delErr) {
          errors.push({ recordId: recIdStr, error: delErr.message });
        }
      }

      // CASE A: Full Synchronization (e.g. on first connect or full sync request)
      if (payload.fullSync || (!payload.changes || payload.changes.length === 0)) {
        // Retrieve records either from client payload or server database
        const notebooks = payload.notebooks || (await Notebook.find({ userId, isDeleted: false }));
        const sections = payload.sections || (await Section.find({ userId, isDeleted: false }));
        const notes = payload.notes || (await Note.find({ userId, isDeleted: false }));

        // 1. Sync Notebooks Manifest
        const notebooksData = notebooks.map((nb) => ({
          id: nb._id || nb.id,
          name: nb.name,
          color: nb.color,
          icon: nb.icon,
          order: nb.order,
          updatedAt: nb.updatedAt
        }));

        let nbMapping = await DriveFileMapping.findOne({ userId, recordType: 'manifest', recordId: 'notebooks' });
        const nbUpload = await googleDriveService.uploadFile(accessToken, {
          fileId: nbMapping?.driveFileId,
          parentId: folders.notebooksFolderId,
          fileName: 'notebooks.json',
          mimeType: 'application/json',
          content: notebooksData
        });

        await DriveFileMapping.findOneAndUpdate(
          { userId, recordType: 'manifest', recordId: 'notebooks' },
          {
            $set: {
              driveFileId: nbUpload.fileId,
              driveParentId: folders.notebooksFolderId,
              fileName: 'notebooks.json',
              lastSyncedAt: new Date()
            }
          },
          { upsert: true }
        );
        syncedCount += notebooks.length;

        // 2. Sync Sections Manifest
        const sectionsData = sections.map((sec) => ({
          id: sec._id || sec.id,
          notebookId: sec.notebookId,
          name: sec.name,
          icon: sec.icon,
          order: sec.order,
          updatedAt: sec.updatedAt
        }));

        let secMapping = await DriveFileMapping.findOne({ userId, recordType: 'manifest', recordId: 'sections' });
        const secUpload = await googleDriveService.uploadFile(accessToken, {
          fileId: secMapping?.driveFileId,
          parentId: folders.sectionsFolderId,
          fileName: 'sections.json',
          mimeType: 'application/json',
          content: sectionsData
        });

        await DriveFileMapping.findOneAndUpdate(
          { userId, recordType: 'manifest', recordId: 'sections' },
          {
            $set: {
              driveFileId: secUpload.fileId,
              driveParentId: folders.sectionsFolderId,
              fileName: 'sections.json',
              lastSyncedAt: new Date()
            }
          },
          { upsert: true }
        );
        syncedCount += sections.length;

        // 3. Sync Individual Notes as human-readable .txt files
        for (const note of notes) {
          try {
            const noteId = (note._id || note.id).toString();
            let noteMapping = await DriveFileMapping.findOne({ userId, recordType: 'note', recordId: noteId });

            // If note is deleted or marked deleted, trash it on Google Drive
            if (note.isDeleted || deletedIds.includes(noteId) || permanentDeletedIds.includes(noteId)) {
              if (noteMapping && noteMapping.driveFileId && !noteMapping.isDeleted) {
                await googleDriveService.trashFile(accessToken, noteMapping.driveFileId);
                noteMapping.isDeleted = true;
                await noteMapping.save();
                syncedCount++;
              }
              continue;
            }

            if (noteMapping && noteMapping.driveFileId && noteMapping.isDeleted) {
              await googleDriveService.untrashFile(accessToken, noteMapping.driveFileId);
            }

            const fileName = this.formatNoteFileName(note, noteId);
            const textContent = this.formatNoteToText(note, noteId);

            const noteUpload = await googleDriveService.uploadFile(accessToken, {
              fileId: noteMapping?.driveFileId,
              parentId: folders.notesFolderId,
              fileName,
              mimeType: 'text/plain; charset=UTF-8',
              content: textContent
            });

            await DriveFileMapping.findOneAndUpdate(
              { userId, recordType: 'note', recordId: noteId },
              {
                $set: {
                  driveFileId: noteUpload.fileId,
                  driveParentId: folders.notesFolderId,
                  fileName,
                  version: noteUpload.version,
                  lastSyncedAt: new Date(),
                  isDeleted: false
                }
              },
              { upsert: true }
            );
            syncedCount++;
          } catch (itemErr) {
            errors.push({ recordId: note._id || note.id, error: itemErr.message });
          }
        }
      }

      // CASE B: Incremental Changes Processing
      if (Array.isArray(payload.changes) && payload.changes.length > 0) {
        for (const change of payload.changes) {
          try {
            const { recordType, recordId, action, data } = change;
            const recIdStr = recordId.toString();

            if (action === 'delete' || action === 'permanentDelete') {
              const mapping = await DriveFileMapping.findOne({ userId, recordType, recordId: recIdStr });
              if (mapping && mapping.driveFileId) {
                if (action === 'permanentDelete') {
                  await googleDriveService.deleteFile(accessToken, mapping.driveFileId);
                  await DriveFileMapping.deleteOne({ _id: mapping._id });
                } else {
                  await googleDriveService.trashFile(accessToken, mapping.driveFileId);
                  mapping.isDeleted = true;
                  await mapping.save();
                }
              }
              syncedCount++;
            } else {
              // Upsert note / notebook / section
              let parentFolderId = folders.notesFolderId;
              let mimeType = 'application/json';
              let fileName = `${recIdStr}.json`;
              let uploadContent = data;

              if (recordType === 'notebook') {
                parentFolderId = folders.notebooksFolderId;
                fileName = `${recIdStr}.json`;
                mimeType = 'application/json';
                uploadContent = data;
              } else if (recordType === 'section') {
                parentFolderId = folders.sectionsFolderId;
                fileName = `${recIdStr}.json`;
                mimeType = 'application/json';
                uploadContent = data;
              } else if (recordType === 'note') {
                parentFolderId = folders.notesFolderId;
                fileName = this.formatNoteFileName(data, recIdStr);
                mimeType = 'text/plain; charset=UTF-8';
                uploadContent = this.formatNoteToText(data, recIdStr);
              }

              const mapping = await DriveFileMapping.findOne({ userId, recordType, recordId: recIdStr });

              const uploadRes = await googleDriveService.uploadFile(accessToken, {
                fileId: mapping?.driveFileId,
                parentId: parentFolderId,
                fileName,
                mimeType,
                content: uploadContent
              });

              await DriveFileMapping.findOneAndUpdate(
                { userId, recordType, recordId: recIdStr },
                {
                  $set: {
                    driveFileId: uploadRes.fileId,
                    driveParentId: parentFolderId,
                    fileName,
                    version: uploadRes.version,
                    lastSyncedAt: new Date(),
                    isDeleted: false
                  }
                },
                { upsert: true }
              );
              syncedCount++;
            }
          } catch (changeErr) {
            errors.push({ change, error: changeErr.message });
          }
        }
      }

      // Update sync completion status
      pref.googleDrive.lastSyncedAt = new Date();
      pref.googleDrive.lastSyncStatus = errors.length > 0 ? 'error' : 'success';
      pref.googleDrive.lastSyncError = errors.length > 0 ? `${errors.length} items failed to sync` : '';
      await pref.save();

      return {
        success: true,
        syncedCount,
        errors,
        lastSyncedAt: pref.googleDrive.lastSyncedAt
      };
    } catch (err) {
      pref.googleDrive.lastSyncStatus = 'error';
      pref.googleDrive.lastSyncError = err.message || 'Sync failed';
      await pref.save();
      throw err;
    }
  }

  /**
   * Generates a complete JSON backup export of user's notes, notebooks, and sections
   * @param {string} userId
   * @param {Object} [clientData] Optional client-provided local data
   * @returns {Promise<Object>}
   */
  async exportBackup(userId, clientData = null) {
    let notebooks = clientData?.notebooks;
    let sections = clientData?.sections;
    let notes = clientData?.notes;

    if (!notebooks || !sections || !notes) {
      notebooks = await Notebook.find({ userId, isDeleted: false });
      sections = await Section.find({ userId, isDeleted: false });
      notes = await Note.find({ userId, isDeleted: false });
    }

    return {
      version: 1,
      appName: 'NoteNest',
      exportedAt: new Date().toISOString(),
      metadata: {
        totalNotebooks: notebooks.length,
        totalSections: sections.length,
        totalNotes: notes.length
      },
      data: {
        notebooks,
        sections,
        notes
      }
    };
  }
}

module.exports = new StorageService();

