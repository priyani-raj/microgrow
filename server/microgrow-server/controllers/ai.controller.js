const { explainConcept, evaluateApproach, generateFlashcards } = require('../services/groq.service');
const DSAProblem = require('../models/DSAProblem');
const UserProblem = require('../models/UserProblem');
const Flashcard = require('../models/Flashcard');

// @route   POST /api/ai/explain
// Body: { topic }
const explain = async (req, res, next) => {
  try {
    const { topic, simpler } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const explanation = await explainConcept(topic, !!simpler);

    res.json({ topic, explanation });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/evaluate
// Body: { problemId, userApproach }
const evaluate = async (req, res, next) => {
  try {
    const { problemId, userApproach } = req.body;

    if (!problemId || !userApproach) {
      return res.status(400).json({ message: 'problemId and userApproach are required' });
    }

    const problem = await DSAProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const result = await evaluateApproach(
      problem.title,
      problem.prompt,
      problem.expectedApproach,
      userApproach
    );

    // Save the user's attempt
    const userProblem = await UserProblem.create({
      userId: req.user._id,
      problemId: problem._id,
      userApproach,
      groqScore: result.score,
      groqFeedback: result.feedback,
    });

    res.json({ ...result, userProblemId: userProblem._id });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/ai/generate-flashcards
// Body: { topic, count? }
const generateCards = async (req, res, next) => {
  try {
    const { topic, count } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'topic is required' });
    }

    const cards = await generateFlashcards(topic, count || 5);

    // Save generated cards to the user's deck
    const saved = await Flashcard.insertMany(
      cards.map((c) => ({
        userId: req.user._id,
        topic,
        question: c.question,
        answer: c.answer,
        difficulty: c.difficulty || 'medium',
      }))
    );

    res.status(201).json({ flashcards: saved });
  } catch (error) {
    next(error);
  }
};

module.exports = { explain, evaluate, generateCards };
