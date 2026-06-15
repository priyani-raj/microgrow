const express = require('express');
const router = express.Router();
const { completeOnboarding, updateSettings } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.put('/onboarding', protect, completeOnboarding);
router.put('/settings', protect, updateSettings);

module.exports = router;
