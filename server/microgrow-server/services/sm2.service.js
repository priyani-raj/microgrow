// SM-2 Spaced Repetition Algorithm
// Reference: SuperMemo SM-2 (simplified for a 3-button rating system)
//
// Rating scale used here:
//   0 = "Again"  (forgot completely)
//   1 = "Hard"   (recalled with difficulty)
//   2 = "Easy"   (recalled easily)
//
// Internally maps to SM-2 quality (0-5):
//   Again -> 1, Hard -> 3, Easy -> 5

const RATING_TO_QUALITY = {
  again: 1,
  hard: 3,
  easy: 5,
};

/**
 * Calculate the next review schedule for a flashcard.
 * @param {Object} card - the flashcard document (must have interval, easeFactor, timesSeen, timesCorrect)
 * @param {string} rating - 'again' | 'hard' | 'easy'
 * @returns {Object} updated fields: { interval, easeFactor, nextReview, timesSeen, timesCorrect }
 */
const calculateNextReview = (card, rating) => {
  const quality = RATING_TO_QUALITY[rating];

  if (quality === undefined) {
    throw new Error('rating must be one of: again, hard, easy');
  }

  let { interval, easeFactor, timesSeen, timesCorrect } = card;

  timesSeen += 1;

  // Update ease factor (SM-2 formula)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3; // floor

  if (quality < 3) {
    // "Again" - reset interval, card needs to be seen again soon
    interval = 1; // review again tomorrow
  } else {
    // "Hard" or "Easy" - grow the interval
    timesCorrect += 1;

    if (interval === 0 || interval === undefined) {
      interval = 1;
    } else if (timesSeen === 1) {
      interval = 1;
    } else if (timesSeen === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // "Hard" grows slower than "Easy"
    if (rating === 'hard') {
      interval = Math.max(1, Math.round(interval * 0.7));
    }
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easeFactor, nextReview, timesSeen, timesCorrect };
};

module.exports = { calculateNextReview };
