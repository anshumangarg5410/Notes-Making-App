const mongoose = require('mongoose');

const notebookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notebook must belong to a user'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Notebook name is required'],
      trim: true,
      maxlength: [60, 'Notebook name cannot exceed 60 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    color: {
      type: String,
      default: 'pink',
      enum: ['pink', 'purple', 'blue', 'green', 'emerald', 'amber', 'rose', 'violet', 'cyan', 'indigo', 'charcoal', 'default']
    },
    icon: {
      type: String,
      default: 'book'
    },
    order: {
      type: Number,
      default: 0
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true
    },
    revision: {
      type: Number,
      default: 1
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

notebookSchema.index({ userId: 1, isDeleted: 1, order: 1 });
notebookSchema.index({ userId: 1, name: 1 });

const Notebook = mongoose.model('Notebook', notebookSchema);

module.exports = Notebook;

