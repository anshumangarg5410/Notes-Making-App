const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to a user'],
      index: true
    },
    title: {
      type: String,
      default: 'Untitled Note',
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: ''
    },
    plainText: {
      type: String,
      default: '',
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notebook',
      default: null,
      index: true
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      default: null,
      index: true
    },
    notebook: {
      type: String,
      default: '',
      trim: true
    },
    section: {
      type: String,
      default: '',
      trim: true
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true
    },
    folder: {
      type: String,
      default: '',
      trim: true
    },
    color: {
      type: String,
      default: 'default',
      enum: ['default', 'cream', 'amber', 'rose', 'emerald', 'sky', 'purple']
    },
    icon: {
      type: String,
      default: 'document'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isFavorite: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    },
    originalFolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null
    },
    revision: {
      type: Number,
      default: 1
    },
    clientCreatedAt: {
      type: Date,
      default: null
    },
    clientUpdatedAt: {
      type: Date,
      default: null
    },
    wordCount: {
      type: Number,
      default: 0
    },
    charCount: {
      type: Number,
      default: 0
    },
    drawings: {
      type: Array,
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

noteSchema.index({ userId: 1, isDeleted: 1, isArchived: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, notebookId: 1, isDeleted: 1 });
noteSchema.index({ userId: 1, sectionId: 1, isDeleted: 1 });
noteSchema.index({ userId: 1, title: 'text', plainText: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

