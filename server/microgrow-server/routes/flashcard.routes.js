const express = require('express');
const router = express.Router();
const {
  getDueFlashcards,
  reviewFlashcard,
  getAllFlashcards,
} = require('../controllers/flashcard.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/due', protect, getDueFlashcards);
router.post('/review', protect, reviewFlashcard);
router.get('/all', protect, getAllFlashcards);

module.exports = router;
