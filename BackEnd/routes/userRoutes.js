const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/me')
  .get(getProfile)
  .put(updateProfile);

router.put('/me/password', updatePassword);

module.exports = router;
