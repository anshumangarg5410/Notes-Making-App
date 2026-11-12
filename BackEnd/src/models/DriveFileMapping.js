const mongoose = require('mongoose');

const driveFileMappingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Drive file mapping must belong to a user'],
      index: true
    },
    recordType: {
      type: String,
      enum: ['notebook', 'section', 'note', 'attachment', 'manifest'],
      required: [true, 'Record type is required']
    },
    recordId: {
      type: String,
      required: [true, 'Record ID is required']
    },
    driveFileId: {
      type: String,
      required: [true, 'Google Drive file ID is required']
    },
    driveParentId: {
      type: String,
      default: ''
    },
    fileName: {
      type: String,
      default: ''
    },
    mimeType: {
      type: String,
      default: 'application/json'
    },
    version: {
      type: Number,
      default: 1
    },
    checksum: {
      type: String,
      default: ''
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index per user, recordType and recordId
driveFileMappingSchema.index({ userId: 1, recordType: 1, recordId: 1 }, { unique: true });
driveFileMappingSchema.index({ userId: 1, driveFileId: 1 });

const DriveFileMapping = mongoose.model('DriveFileMapping', driveFileMappingSchema);

module.exports = DriveFileMapping;

