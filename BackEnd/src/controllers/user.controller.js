const fs = require('fs');
const User = require('../models/User');
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const { isCloudinaryConfigured, uploadToCloudinary } = require('../config/cloudinary');

class UserController {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
          bio: user.bio || 'Student • Developer • Building cool stuff with code.',
          avatar: user.avatar || user.avatarUrl || '',
          coverImage: user.coverImage || '',
          plan: user.plan || 'Pro Plan',
          createdAt: user.createdAt,
          preferences: user.preferences || {
            theme: 'dark',
            accentColor: 'purple',
            offlineMode: true,
            autoSync: true,
            showNoteCount: true,
            compactSidebar: false
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const { name, username, bio, avatar, coverImage } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name && name.trim()) user.name = name.trim();
      if (username !== undefined) user.username = username.trim().replace(/^@/, '');
      if (bio !== undefined) user.bio = bio.trim();
      if (avatar !== undefined) {
        user.avatar = avatar;
        user.avatarUrl = avatar;
      }
      if (coverImage !== undefined) user.coverImage = coverImage;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
          bio: user.bio,
          avatar: user.avatar || user.avatarUrl || '',
          coverImage: user.coverImage || '',
          plan: user.plan || 'Pro Plan',
          createdAt: user.createdAt,
          preferences: user.preferences
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {
    try {
      let avatarUrl = '';

      if (req.file) {
        if (isCloudinaryConfigured()) {
          try {
            const uploadResult = await uploadToCloudinary(req.file.path, {
              folder: 'notenest/avatars'
            });
            if (uploadResult?.secure_url) {
              avatarUrl = uploadResult.secure_url;
              // Clean up local temp upload
              try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
          } catch (cloudErr) {
            console.warn('Cloudinary upload failed, using local storage fallback:', cloudErr.message);
            avatarUrl = `/uploads/${req.file.filename}`;
          }
        } else {
          avatarUrl = `/uploads/${req.file.filename}`;
        }
      } else if (req.body?.avatar) {
        if (isCloudinaryConfigured() && typeof req.body.avatar === 'string' && req.body.avatar.startsWith('data:image')) {
          try {
            const uploadResult = await uploadToCloudinary(req.body.avatar, {
              folder: 'notenest/avatars'
            });
            avatarUrl = uploadResult?.secure_url || req.body.avatar;
          } catch (cloudErr) {
            console.warn('Cloudinary upload failed for data URI:', cloudErr.message);
            avatarUrl = req.body.avatar;
          }
        } else {
          avatarUrl = req.body.avatar;
        }
      }

      if (!avatarUrl) {
        return res.status(400).json({
          success: false,
          message: 'No avatar image was provided.'
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.avatar = avatarUrl;
      user.avatarUrl = avatarUrl;
      await user.save();

      const userPayload = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.coverImage || '',
        plan: user.plan || 'Pro Plan',
        preferences: user.preferences
      };

      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: {
          avatar: user.avatar,
          user: userPayload
        },
        user: userPayload
      });
    } catch (error) {
      next(error);
    }
  }

  async removeAvatar(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.avatar = '';
      user.avatarUrl = '';
      await user.save();

      const userPayload = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username ? `@${user.username}` : `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        bio: user.bio,
        avatar: '',
        coverImage: user.coverImage || '',
        preferences: user.preferences
      };

      res.status(200).json({
        success: true,
        message: 'Avatar removed successfully',
        data: {
          avatar: '',
          user: userPayload
        },
        user: userPayload
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCover(req, res, next) {
    try {
      let coverUrl = '';

      if (req.file) {
        if (isCloudinaryConfigured()) {
          try {
            const uploadResult = await uploadToCloudinary(req.file.path, {
              folder: 'notenest/covers',
              transformation: [
                { width: 1200, height: 400, crop: 'fill' },
                { quality: 'auto', fetch_format: 'auto' }
              ]
            });
            if (uploadResult?.secure_url) {
              coverUrl = uploadResult.secure_url;
              try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
          } catch (cloudErr) {
            console.warn('Cloudinary cover upload failed, using local storage fallback:', cloudErr.message);
            coverUrl = `/uploads/${req.file.filename}`;
          }
        } else {
          coverUrl = `/uploads/${req.file.filename}`;
        }
      } else if (req.body?.coverImage) {
        coverUrl = req.body.coverImage;
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.coverImage = coverUrl || '';
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Cover image updated successfully',
        data: {
          coverImage: user.coverImage
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPreferences(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      res.status(200).json({
        success: true,
        data: user.preferences || {
          theme: 'dark',
          accentColor: 'purple',
          offlineMode: true,
          autoSync: true,
          showNoteCount: true,
          compactSidebar: false
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePreferences(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const current = user.preferences || {};
      user.preferences = { ...current, ...req.body };
      user.markModified('preferences');
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Preferences saved',
        data: user.preferences
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Both current and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
      }

      const user = await User.findById(req.user.id).select('+password +passwordHash');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async changeEmail(req, res, next) {
    try {
      const { newEmail } = req.body;
      if (!newEmail || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(newEmail)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
      }

      const existing = await User.findOne({ email: newEmail.toLowerCase().trim() });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already in use by another account' });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.email = newEmail.toLowerCase().trim();
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email address updated successfully',
        data: { email: user.email }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req, res, next) {
    try {
      const userId = req.user.id;
      await Note.deleteMany({ userId });
      await Folder.deleteMany({ userId });
      await User.findByIdAndDelete(userId);

      res.status(200).json({
        success: true,
        message: 'Account and associated data deleted permanently'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();

