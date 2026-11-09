const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      select: false
    },
    // Maintained for backward compatibility with existing Atlas records
    passwordHash: {
      type: String,
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      trim: true,
      default: ''
    },
    bio: {
      type: String,
      trim: true,
      default: 'Student • Developer • Building cool stuff with code.'
    },
    plan: {
      type: String,
      default: 'Pro Plan'
    },
    coverImage: {
      type: String,
      default: ''
    },
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        theme: 'dark',
        accentColor: 'purple',
        offlineMode: true,
        autoSync: true,
        showNoteCount: true,
        compactSidebar: false
      }
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    passwordChangedAt: {
      type: Date
    },
    // Array of active refresh tokens (hashed) for secure session rotation & revocation
    refreshTokens: [
      {
        tokenHash: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Fallback avatar/avatarUrl
        ret.avatar = ret.avatar || ret.avatarUrl || '';
        delete ret.password;
        delete ret.passwordHash;
        delete ret.refreshTokens;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook: Hash password with bcrypt before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    this.passwordHash = hash; // Synchronize for schema compatibility

    if (!this.isNew) {
      this.passwordChangedAt = new Date(Date.now() - 1000);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const hashToCompare = this.password || this.passwordHash;
  if (!hashToCompare) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, hashToCompare);
};

// Check if password was changed after token issue time
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

