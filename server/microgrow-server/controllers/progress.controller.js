const Session = require('../models/Session');
const Flashcard = require('../models/Flashcard');
const UserProblem = require('../models/UserProblem');
const User = require('../models/User');
const { calculateReadinessScore } = require('../services/score.service');

// @route   GET /api/progress
// Full dashboard data: streak, readiness score, topic breakdown, weekly stats
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // --- Topic coverage: distinct topics across all sessions ---
    const sessions = await Session.find({ userId });
    const topicsCovered = new Set(sessions.map((s) => s.topic)).size;

    // --- Flashcard stats: aggregate timesSeen / timesCorrect ---
    const flashcards = await Flashcard.find({ userId });
    const flashcardStats = flashcards.reduce(
      (acc, card) => {
        acc.totalSeen += card.timesSeen;
        acc.totalCorrect += card.timesCorrect;
        return acc;
      },
      { totalSeen: 0, totalCorrect: 0 }
    );

    // --- DSA stats: average groqScore across attempts ---
    const userProblems = await UserProblem.find({ userId });
    const dsaStats = userProblems.reduce(
      (acc, p) => {
        if (typeof p.groqScore === 'number') {
          acc.totalScore += p.groqScore;
          acc.count += 1;
        }
        return acc;
      },
      { totalScore: 0, count: 0 }
    );

    // --- Readiness score ---
    const readiness = calculateReadinessScore({
      topicsCovered,
      flashcardStats,
      dsaStats,
      streak: user.streak.current,
    });

    // Save updated score on user doc
    user.readinessScore = readiness.total;
    await user.save();

    // --- Per-topic breakdown ---
    const topicMap = {};
    sessions.forEach((s) => {
      if (!topicMap[s.topic]) {
        topicMap[s.topic] = { sessions: 0, totalMinutes: 0 };
      }
      topicMap[s.topic].sessions += 1;
      topicMap[s.topic].totalMinutes += s.duration;
    });

    // --- Weekly stats (last 7 days) ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weekSessions = sessions.filter((s) => s.createdAt >= sevenDaysAgo);
    const weeklyMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const weekFlashcardReviews = flashcards.filter(
      (c) => c.updatedAt >= sevenDaysAgo && c.timesSeen > 0
    ).length;
    const weekDSAProblems = userProblems.filter((p) => p.createdAt >= sevenDaysAgo).length;

    res.json({
      streak: user.streak,
      readinessScore: readiness.total,
      readinessBreakdown: readiness.breakdown,
      totalSessions: user.totalSessions,
      totalMinutes: user.totalMinutes,
      topicsCovered,
      topicBreakdown: topicMap,
      weeklyStats: {
        minutesSpent: weeklyMinutes,
        sessionsCompleted: weekSessions.length,
        flashcardsReviewed: weekFlashcardReviews,
        dsaProblemsAttempted: weekDSAProblems,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress };
