const mongoose = require('mongoose');

const userProblemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DSAProblem',
      required: true,
    },
    userApproach: {
      type: String,
      required: true,
    },
    groqScore: {
      type: Number,
    },
    groqFeedback: {
      type: String,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProblem', userProblemSchema);
