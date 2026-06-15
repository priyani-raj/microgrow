const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    // SM-2 spaced repetition fields
    interval: {
      type: Number, // days until next review
      default: 1,
    },
    easeFactor: {
      type: Number,
      default: 2.5,
    },
    nextReview: {
      type: Date,
      default: Date.now, // due immediately when created
    },
    timesSeen: {
      type: Number,
      default: 0,
    },
    timesCorrect: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flashcard', flashcardSchema);
