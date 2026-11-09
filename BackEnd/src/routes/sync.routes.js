const express = require('express');
const syncController = require('../controllers/sync.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/push', syncController.push);
router.post('/pull', syncController.pull);
router.get('/status', syncController.status);

module.exports = router;

