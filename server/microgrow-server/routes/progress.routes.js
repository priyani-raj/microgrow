const express = require('express');
const router = express.Router();
const { getProgress } = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getProgress);

module.exports = router;
