const mongoose = require('mongoose');

const storagePreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Storage preference must belong to a user'],
      unique: true,
      index: true
    },
    provider: {
      type: String,
      enum: ['local', 'google-drive'],
      default: 'local'
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
      index: true
    },
    googleDrive: {
      connected: {
        type: Boolean,
        default: false
      },
      email: {
        type: String,
        default: '',
        trim: true
      },
      refreshTokenEncrypted: {
        type: String,
        default: '',
        select: false // Never expose encrypted token in standard queries
      },
      rootFolderId: {
        type: String,
        default: ''
      },
      notebooksFolderId: {
        type: String,
        default: ''
      },
      sectionsFolderId: {
        type: String,
        default: ''
      },
      notesFolderId: {
        type: String,
        default: ''
      },
      attachmentsFolderId: {
        type: String,
        default: ''
      },
      scope: {
        type: String,
        default: 'https://www.googleapis.com/auth/drive.file'
      },
      lastSyncedAt: {
        type: Date,
        default: null
      },
      lastSyncStatus: {
        type: String,
        enum: ['idle', 'syncing', 'success', 'error'],
        default: 'idle'
      },
      lastSyncError: {
        type: String,
        default: ''
      }
    },
    stats: {
      localRecordsCount: { type: Number, default: 0 },
      cloudRecordsCount: { type: Number, default: 0 },
      pendingSyncCount: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret.googleDrive?.refreshTokenEncrypted;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const StoragePreference = mongoose.model('StoragePreference', storagePreferenceSchema);

module.exports = StoragePreference;
