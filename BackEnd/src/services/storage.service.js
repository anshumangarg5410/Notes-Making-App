const StoragePreference = require('../models/StoragePreference');
const DriveFileMapping = require('../models/DriveFileMapping');
const Note = require('../models/Note');
const Notebook = require('../models/Notebook');
const Section = require('../models/Section');
const googleDriveService = require('./googleDrive.service');

class StorageService {
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
      existingMongoData: {
        hasData: mongoNotesCount > 0 || mongoNotebooksCount > 0,
        notesCount: mongoNotesCount,
        notebooksCount: mongoNotebooksCount,
        sectionsCount: mongoSectionsCount
      }
    };
  }

  /**
   * Updates storage preferences (provider, onboarding status)
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

    const pref = await StoragePreference.findOneAndUpdate(
      { userId },
      { $set: allowed },
      { new: true, upsert: true }
    );

    return pref;
  }

  /**
   * Gets Google Drive connection status for user
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getGoogleDriveStatus(userId) {
    const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
    if (!pref || !pref.googleDrive?.connected) {
      return {
        connected: false,
        provider: pref?.provider || 'local',
        email: '',
        lastSyncedAt: null,
        rootFolderId: null,
        onboardingCompleted: pref?.onboardingCompleted || false
      };
    }

    // Check if token is still valid
    let tokenValid = true;
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

    return {
      connected: pref.googleDrive.connected,
      provider: pref.provider,
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
    if (pref && pref.googleDrive?.refreshTokenEncrypted) {
      await googleDriveService.revokeToken(pref.googleDrive.refreshTokenEncrypted);
    }

    await StoragePreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          provider: 'local',
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
    const pref = await StoragePreference.findOne({ userId }).select('+googleDrive.refreshTokenEncrypted');
    if (!pref || !pref.googleDrive?.connected || !pref.googleDrive.refreshTokenEncrypted) {
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

        // 3. Sync Individual Notes
        for (const note of notes) {
          try {
            const noteId = (note._id || note.id).toString();
            let noteMapping = await DriveFileMapping.findOne({ userId, recordType: 'note', recordId: noteId });

            const notePayload = {
              id: noteId,
              title: note.title || 'Untitled Note',
              content: note.content || '',
              plainText: note.plainText || '',
              tags: note.tags || [],
              notebookId: note.notebookId,
              sectionId: note.sectionId,
              notebook: note.notebook,
              section: note.section,
              drawings: note.drawings || [],
              isPinned: Boolean(note.isPinned),
              isFavorite: Boolean(note.isFavorite),
              isDeleted: Boolean(note.isDeleted),
              revision: note.revision || 1,
              updatedAt: note.updatedAt || new Date().toISOString()
            };

            const fileName = `${noteId}.json`;
            const noteUpload = await googleDriveService.uploadFile(accessToken, {
              fileId: noteMapping?.driveFileId,
              parentId: folders.notesFolderId,
              fileName,
              mimeType: 'application/json',
              content: notePayload
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

            if (action === 'delete') {
              const mapping = await DriveFileMapping.findOne({ userId, recordType, recordId: recIdStr });
              if (mapping && mapping.driveFileId) {
                await googleDriveService.trashFile(accessToken, mapping.driveFileId);
                mapping.isDeleted = true;
                await mapping.save();
              }
              syncedCount++;
            } else {
              // Upsert note / notebook / section
              let parentFolderId = folders.notesFolderId;
              if (recordType === 'notebook') parentFolderId = folders.notebooksFolderId;
              if (recordType === 'section') parentFolderId = folders.sectionsFolderId;

              const mapping = await DriveFileMapping.findOne({ userId, recordType, recordId: recIdStr });
              const fileName = `${recIdStr}.json`;

              const uploadRes = await googleDriveService.uploadFile(accessToken, {
                fileId: mapping?.driveFileId,
                parentId: parentFolderId,
                fileName,
                mimeType: 'application/json',
                content: data
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

