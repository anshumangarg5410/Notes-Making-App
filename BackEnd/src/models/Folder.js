const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Folder must belong to a user'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [60, 'Folder name cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    color: {
      type: String,
      default: 'purple',
      enum: ['purple', 'blue', 'green', 'amber', 'rose', 'violet', 'cyan', 'indigo', 'default']
    },
    icon: {
      type: String,
      default: 'folder'
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true
    },
    isPinned: {
      type: Boolean,
      default: false
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

folderSchema.index({ userId: 1, parentId: 1, name: 1 });

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
