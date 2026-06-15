const mongoose = require('mongoose');

const dsaProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    expectedApproach: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    estimatedMins: {
      type: Number,
      default: 10,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DSAProblem', dsaProblemSchema);
