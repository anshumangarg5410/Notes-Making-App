const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Activity must belong to a user'],
      index: true
    },
    action: {
      type: String,
      required: true,
      enum: [
        'created_note',
        'updated_note',
        'deleted_note',
        'restored_note',
        'favorited_note',
        'saved_note_version',
        'restored_note_version',
        'created_folder',
        'updated_folder',
        'deleted_folder',
        'restored_folder'
      ]
    },
    entityType: {
      type: String,
      required: true,
      enum: ['note', 'folder']
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    entityTitle: {
      type: String,
      default: '',
      trim: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
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

activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

