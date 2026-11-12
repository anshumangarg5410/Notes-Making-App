const mongoose = require('mongoose');

const noteVersionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Version must belong to a user'],
      index: true
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: [true, 'Version must belong to a note'],
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
    drawings: {
      type: Array,
      default: []
    },
    wordCount: {
      type: Number,
      default: 0
    },
    charCount: {
      type: Number,
      default: 0
    },
    versionType: {
      type: String,
      enum: ['automatic', 'manual', 'pre-restore'],
      default: 'automatic',
      index: true
    },
    versionName: {
      type: String,
      default: '',
      trim: true,
      maxlength: [100, 'Version name cannot exceed 100 characters']
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
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

// Compound indexes for high-speed chronological lookups and retention pruning
noteVersionSchema.index({ noteId: 1, createdAt: -1 });
noteVersionSchema.index({ userId: 1, noteId: 1, createdAt: -1 });
noteVersionSchema.index({ noteId: 1, versionType: 1, createdAt: 1 });

const NoteVersion = mongoose.model('NoteVersion', noteVersionSchema);

module.exports = NoteVersion;
