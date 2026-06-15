const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['dsa', 'flashcard', 'concept'],
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    score: {
      type: Number, // 0-5, set after AI feedback (for dsa) or accuracy % (for flashcard)
      default: null,
    },
    aiFeedback: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);
