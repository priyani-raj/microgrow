const express = require('express');
const router = express.Router();
const { explain, evaluate, generateCards } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/explain', protect, explain);
router.post('/evaluate', protect, evaluate);
router.post('/generate-flashcards', protect, generateCards);

module.exports = router;
