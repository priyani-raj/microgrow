const Session = require('../models/Session');
const User = require('../models/User');
const Flashcard = require('../models/Flashcard');
const { updateStreak } = require('../services/streak.service');

// @route   GET /api/session/start?minutes=10
// Decides what activity the user should do based on time available
const startSession = async (req, res, next) => {
  try {
    const minutes = parseInt(req.query.minutes);

    if (!minutes || minutes < 1) {
      return res.status(400).json({ message: 'Please provide a valid number of minutes' });
    }

    const user = req.user;

    // Pick activity type based on time available
    let activityType;
    if (minutes <= 6) {
      activityType = 'flashcard'; // quick reviews
    } else if (minutes <= 12) {
      activityType = 'concept'; // 60-second explainer + a couple flashcards
    } else {
      activityType = 'dsa'; // enough time for a problem
    }

    // Pick topic: prioritize weak topics, else random
    let topic;
    if (user.weakTopics && user.weakTopics.length > 0) {
      topic = user.weakTopics[Math.floor(Math.random() * user.weakTopics.length)];
    } else {
      const defaultTopics = ['Arrays', 'Linked Lists', 'Trees', 'OS', 'DBMS', 'CN'];
      topic = defaultTopics[Math.floor(Math.random() * defaultTopics.length)];
    }

    // For flashcard sessions, check if there are due cards
    let dueFlashcards = [];
    if (activityType === 'flashcard' || activityType === 'concept') {
      dueFlashcards = await Flashcard.find({
        userId: user._id,
        nextReview: { $lte: new Date() },
      }).limit(5);

      // If no due cards for the chosen topic, fall back gracefully
      if (dueFlashcards.length === 0 && activityType === 'flashcard') {
        activityType = 'concept';
      }
    }

    res.json({
      activityType,
      topic,
      minutesAvailable: minutes,
      dueFlashcards,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/session/complete
// Body: { type, topic, duration, score, aiFeedback }
const completeSession = async (req, res, next) => {
  try {
    const { type, topic, duration, score, aiFeedback } = req.body;

    if (!type || !topic || !duration) {
      return res.status(400).json({ message: 'type, topic, and duration are required' });
    }

    // Save the session
    const session = await Session.create({
      userId: req.user._id,
      type,
      topic,
      duration,
      score: score ?? null,
      aiFeedback: aiFeedback || '',
    });

    // Update user stats
    const user = await User.findById(req.user._id);
    user.totalSessions += 1;
    user.totalMinutes += duration;

    updateStreak(user);

    await user.save();

    res.status(201).json({
      session,
      streak: user.streak,
      totalSessions: user.totalSessions,
      totalMinutes: user.totalMinutes,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/session/history
const getSessionHistory = async (req, res, next) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

module.exports = { startSession, completeSession, getSessionHistory };
