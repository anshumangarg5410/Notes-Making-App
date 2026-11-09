const express = require('express');
const searchController = require('../controllers/search.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/', searchController.search);

module.exports = router;
