const Flashcard = require('../models/Flashcard');
const { calculateNextReview } = require('../services/sm2.service');

// @route   GET /api/flashcards/due
// Returns cards due for review today (nextReview <= now)
const getDueFlashcards = async (req, res, next) => {
  try {
    const { topic, limit } = req.query;

    const query = {
      userId: req.user._id,
      nextReview: { $lte: new Date() },
    };

    if (topic) {
      query.topic = topic;
    }

    const cards = await Flashcard.find(query)
      .sort({ nextReview: 1 })
      .limit(parseInt(limit) || 10);

    res.json({ count: cards.length, flashcards: cards });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/flashcards/review
// Body: { cardId, rating }  rating: 'again' | 'hard' | 'easy'
const reviewFlashcard = async (req, res, next) => {
  try {
    const { cardId, rating } = req.body;

    if (!cardId || !rating) {
      return res.status(400).json({ message: 'cardId and rating are required' });
    }

    if (!['again', 'hard', 'easy'].includes(rating)) {
      return res.status(400).json({ message: 'rating must be again, hard, or easy' });
    }

    const card = await Flashcard.findOne({ _id: cardId, userId: req.user._id });

    if (!card) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    const updates = calculateNextReview(card, rating);

    card.interval = updates.interval;
    card.easeFactor = updates.easeFactor;
    card.nextReview = updates.nextReview;
    card.timesSeen = updates.timesSeen;
    card.timesCorrect = updates.timesCorrect;

    await card.save();

    res.json({
      card,
      nextReviewIn: `${updates.interval} day${updates.interval === 1 ? '' : 's'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/flashcards/all
// All flashcards for the user, optionally filtered by topic
const getAllFlashcards = async (req, res, next) => {
  try {
    const { topic } = req.query;

    const query = { userId: req.user._id };
    if (topic) query.topic = topic;

    const cards = await Flashcard.find(query).sort({ createdAt: -1 });

    res.json({ count: cards.length, flashcards: cards });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDueFlashcards, reviewFlashcard, getAllFlashcards };
