const User = require('../models/User');
const Note = require('../models/Note');
const Folder = require('../models/Folder');

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
      const avatarUrl = req.file ? `/uploads/${req.file.filename}` : req.body?.avatar;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.avatar = avatarUrl || '';
      user.avatarUrl = avatarUrl || '';
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Avatar updated successfully',
        data: { avatar: user.avatar }
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

      res.status(200).json({
        success: true,
        message: 'Avatar removed successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCover(req, res, next) {
    try {
      const coverUrl = req.file ? `/uploads/${req.file.filename}` : req.body?.coverImage;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.coverImage = coverUrl || '';
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Cover image updated successfully',
        data: { coverImage: user.coverImage }
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

