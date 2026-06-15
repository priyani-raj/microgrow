const express = require('express');
const router = express.Router();
const {
  startSession,
  completeSession,
  getSessionHistory,
} = require('../controllers/session.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/start', protect, startSession);
router.post('/complete', protect, completeSession);
router.get('/history', protect, getSessionHistory);

module.exports = router;
