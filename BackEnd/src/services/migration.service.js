const mongoose = require('mongoose');
const Folder = require('../models/Folder');
const Notebook = require('../models/Notebook');
const Section = require('../models/Section');
const Note = require('../models/Note');

class MigrationService {
  /**
   * Safe, idempotent migration from Folders/Subfolders to Notebooks/Sections
   */
  async migrateFoldersToNotebooks() {
    try {
      console.log('[Migration] Checking for folder-to-notebook migration...');

      // 1. Fetch all existing folders
      const folders = await Folder.find({}).lean();
      if (!folders || folders.length === 0) {
        console.log('[Migration] No existing folders to migrate.');
        return { migratedNotebooks: 0, migratedSections: 0, migratedNotes: 0 };
      }

      let migratedNotebooks = 0;
      let migratedSections = 0;
      let migratedNotes = 0;

      // Split into root folders and subfolders
      const rootFolders = folders.filter((f) => !f.parentId);
      const subfolders = folders.filter((f) => Boolean(f.parentId));

      // Map to keep track of folder._id -> notebook._id
      const folderToNotebookMap = new Map();
      // Map to keep track of subfolder._id -> section._id
      const subfolderToSectionMap = new Map();
      // Map to keep track of notebook._id -> general section._id
      const notebookGeneralSectionMap = new Map();

      // 2. Migrate Root Folders -> Notebooks
      for (const root of rootFolders) {
        let notebook = await Notebook.findOne({
          $or: [
            { _id: root._id },
            { userId: root.userId, name: root.name }
          ]
        });

        if (!notebook) {
          try {
            notebook = await Notebook.create({
              _id: root._id,
              userId: root.userId,
              name: root.name,
              description: root.description || '',
              color: root.color || 'pink',
              icon: 'book',
              isPinned: Boolean(root.isPinned),
              isDeleted: Boolean(root.isDeleted),
              deletedAt: root.deletedAt || null,
              createdAt: root.createdAt || new Date(),
              updatedAt: root.updatedAt || new Date()
            });
            migratedNotebooks += 1;
          } catch (err) {
            // In case of _id duplicate with different structure, create with auto _id
            notebook = await Notebook.create({
              userId: root.userId,
              name: root.name,
              description: root.description || '',
              color: root.color || 'pink',
              icon: 'book',
              isPinned: Boolean(root.isPinned),
              isDeleted: Boolean(root.isDeleted),
              deletedAt: root.deletedAt || null
            });
            migratedNotebooks += 1;
          }
        }

        folderToNotebookMap.set(root._id.toString(), notebook);

        // Ensure every notebook has a "General" section for notes placed directly in the notebook
        let generalSection = await Section.findOne({
          notebookId: notebook._id,
          userId: root.userId,
          name: 'General'
        });

        if (!generalSection) {
          generalSection = await Section.create({
            notebookId: notebook._id,
            userId: root.userId,
            name: 'General',
            icon: 'bookmark',
            color: 'default',
            order: 0
          });
          migratedSections += 1;
        }

        notebookGeneralSectionMap.set(notebook._id.toString(), generalSection);
      }

      // 3. Migrate Subfolders -> Sections
      for (const sub of subfolders) {
        const parentNotebook = folderToNotebookMap.get(sub.parentId.toString());
        if (!parentNotebook) continue;

        let section = await Section.findOne({
          $or: [
            { _id: sub._id },
            { userId: sub.userId, notebookId: parentNotebook._id, name: sub.name }
          ]
        });

        if (!section) {
          try {
            section = await Section.create({
              _id: sub._id,
              notebookId: parentNotebook._id,
              userId: sub.userId,
              name: sub.name,
              icon: 'bookmark',
              color: sub.color || 'default',
              order: 1,
              isDeleted: Boolean(sub.isDeleted),
              deletedAt: sub.deletedAt || null,
              createdAt: sub.createdAt || new Date(),
              updatedAt: sub.updatedAt || new Date()
            });
            migratedSections += 1;
          } catch (err) {
            section = await Section.create({
              notebookId: parentNotebook._id,
              userId: sub.userId,
              name: sub.name,
              icon: 'bookmark',
              color: sub.color || 'default',
              order: 1,
              isDeleted: Boolean(sub.isDeleted),
              deletedAt: sub.deletedAt || null
            });
            migratedSections += 1;
          }
        }

        subfolderToSectionMap.set(sub._id.toString(), section);
      }

      // 4. Migrate Notes Association
      const notes = await Note.find({
        $or: [
          { notebookId: null },
          { sectionId: null },
          { notebookId: { $exists: false } }
        ]
      });

      for (const note of notes) {
        let updated = false;

        // Check if note references a subfolder (now a section)
        if (note.folderId && subfolderToSectionMap.has(note.folderId.toString())) {
          const section = subfolderToSectionMap.get(note.folderId.toString());
          const parentNotebook = folderToNotebookMap.get(section.notebookId.toString());

          note.sectionId = section._id;
          note.notebookId = section.notebookId;
          note.section = section.name;
          note.notebook = parentNotebook ? parentNotebook.name : '';
          updated = true;
        }
        // Check if note references a root folder (now a notebook)
        else if (note.folderId && folderToNotebookMap.has(note.folderId.toString())) {
          const notebook = folderToNotebookMap.get(note.folderId.toString());
          const generalSection = notebookGeneralSectionMap.get(notebook._id.toString());

          note.notebookId = notebook._id;
          note.notebook = notebook.name;
          if (generalSection) {
            note.sectionId = generalSection._id;
            note.section = generalSection.name;
          }
          updated = true;
        }
        // Fallback by folder name string
        else if (note.folder && typeof note.folder === 'string' && note.folder.trim()) {
          const folderName = note.folder.trim().toLowerCase();
          const matchingNotebook = Array.from(folderToNotebookMap.values()).find(
            (nb) => nb.name.toLowerCase() === folderName
          );

          if (matchingNotebook) {
            const generalSection = notebookGeneralSectionMap.get(matchingNotebook._id.toString());
            note.notebookId = matchingNotebook._id;
            note.notebook = matchingNotebook.name;
            if (generalSection) {
              note.sectionId = generalSection._id;
              note.section = generalSection.name;
            }
            updated = true;
          }
        }

        if (updated) {
          await note.save();
          migratedNotes += 1;
        }
      }

      console.log(
        `[Migration Complete] Notebooks: ${migratedNotebooks}, Sections: ${migratedSections}, Notes: ${migratedNotes}`
      );

      return { migratedNotebooks, migratedSections, migratedNotes };
    } catch (error) {
      console.error('[Migration Error] Folder-to-notebook migration error:', error);
      return { error: error.message };
    }
  }
}

module.exports = new MigrationService();

