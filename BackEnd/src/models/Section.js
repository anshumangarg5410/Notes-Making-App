const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notebook',
      required: [true, 'Section must belong to a notebook'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Section must belong to a user'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Section name is required'],
      trim: true,
      maxlength: [60, 'Section name cannot exceed 60 characters']
    },
    icon: {
      type: String,
      default: 'bookmark'
    },
    color: {
      type: String,
      default: 'default'
    },
    order: {
      type: Number,
      default: 0
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

sectionSchema.index({ notebookId: 1, userId: 1, isDeleted: 1, order: 1 });
sectionSchema.index({ userId: 1, notebookId: 1, name: 1 });

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
