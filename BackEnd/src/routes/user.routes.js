const express = require('express');
const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/avatar', userController.updateAvatar);
router.delete('/avatar', userController.removeAvatar);
router.post('/cover', userController.updateCover);

router.get('/preferences', userController.getPreferences);
router.patch('/preferences', userController.updatePreferences);

router.patch('/password', userController.changePassword);
router.patch('/email', userController.changeEmail);
router.delete('/account', userController.deleteAccount);

module.exports = router;
