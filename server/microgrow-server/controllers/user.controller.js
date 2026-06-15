const User = require('../models/User');

// @route   PUT /api/user/onboarding
// Body: { targetCompanies: [...], weakTopics: [...] }
const completeOnboarding = async (req, res, next) => {
  try {
    const { targetCompanies, weakTopics } = req.body;

    if (!Array.isArray(targetCompanies) || !Array.isArray(weakTopics)) {
      return res.status(400).json({ message: 'targetCompanies and weakTopics must be arrays' });
    }

    const user = await User.findById(req.user._id);

    user.targetCompanies = targetCompanies;
    user.weakTopics = weakTopics;
    user.onboardingComplete = true;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetCompanies: user.targetCompanies,
      weakTopics: user.weakTopics,
      onboardingComplete: user.onboardingComplete,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/user/settings
// Body: { name?, targetCompanies?, weakTopics? }
// Partial update of profile fields
const updateSettings = async (req, res, next) => {
  try {
    const { name, targetCompanies, weakTopics } = req.body;

    const user = await User.findById(req.user._id);

    if (name !== undefined) user.name = name;
    if (Array.isArray(targetCompanies)) user.targetCompanies = targetCompanies;
    if (Array.isArray(weakTopics)) user.weakTopics = weakTopics;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      targetCompanies: user.targetCompanies,
      weakTopics: user.weakTopics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { completeOnboarding, updateSettings };
