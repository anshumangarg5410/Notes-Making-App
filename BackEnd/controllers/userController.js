const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatarUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) {
      user.name = name.trim();
    }

    if (email && email.toLowerCase().trim() !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
      user.email = email.toLowerCase().trim();
    }

    if (avatarUrl !== undefined) {
      user.avatarUrl = avatarUrl;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    user.passwordHash = await User.hashPassword(newPassword);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword
};
