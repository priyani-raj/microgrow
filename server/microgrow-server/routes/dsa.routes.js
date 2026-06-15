const express = require('express');
const router = express.Router();
const { getProblems, getRandomProblem } = require('../controllers/dsa.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/problems', protect, getProblems);
router.get('/problems/random', protect, getRandomProblem);

module.exports = router;
