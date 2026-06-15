const DSAProblem = require('../models/DSAProblem');

// @route   GET /api/dsa/problems?topic=Trees
const getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.query;

    const query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const problems = await DSAProblem.find(query).select(
      'title topic difficulty estimatedMins tags'
    );

    res.json({ count: problems.length, problems });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/dsa/problems/random?topic=Trees
// Returns one random problem (optionally filtered by topic), without revealing expectedApproach
// Falls back to any topic if none exist for the requested one
const getRandomProblem = async (req, res, next) => {
  try {
    const { topic } = req.query;

    let query = {};
    if (topic) query.topic = topic;

    let count = await DSAProblem.countDocuments(query);

    // Fallback: no problems for this specific topic, use any topic
    if (count === 0) {
      query = {};
      count = await DSAProblem.countDocuments(query);
    }

    if (count === 0) {
      return res.status(404).json({ message: 'No DSA problems available. Please seed the database.' });
    }

    const random = Math.floor(Math.random() * count);
    const problem = await DSAProblem.findOne(query)
      .skip(random)
      .select('title topic difficulty prompt estimatedMins tags');

    res.json(problem);
  } catch (error) {
    next(error);
  }
};

module.exports = { getProblems, getRandomProblem };
