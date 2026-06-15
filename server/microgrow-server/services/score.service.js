// Calculates a 0-100 "Interview Readiness Score" based on user activity.
//
// Weighting:
//   - Topic coverage (40%)   - how many distinct topics have been practiced
//   - Flashcard accuracy (25%) - % of flashcard reviews rated hard/easy vs again
//   - DSA performance (25%)  - average groqScore across attempted problems
//   - Consistency (10%)      - current streak, capped at 10 days for full marks

const TOTAL_CORE_TOPICS = 6; // Arrays, Linked Lists, Trees, OS, DBMS, CN

const calculateReadinessScore = ({ topicsCovered, flashcardStats, dsaStats, streak }) => {
  // 1. Topic coverage (40 points)
  const topicScore = Math.min(topicsCovered / TOTAL_CORE_TOPICS, 1) * 40;

  // 2. Flashcard accuracy (25 points)
  let flashcardScore = 0;
  if (flashcardStats.totalSeen > 0) {
    const accuracy = flashcardStats.totalCorrect / flashcardStats.totalSeen;
    flashcardScore = accuracy * 25;
  }

  // 3. DSA performance (25 points) - groqScore is 1-5, normalize to 0-1
  let dsaScore = 0;
  if (dsaStats.count > 0) {
    const avgScore = dsaStats.totalScore / dsaStats.count; // 1-5
    dsaScore = (avgScore / 5) * 25;
  }

  // 4. Consistency (10 points) - streak capped at 10 days
  const consistencyScore = Math.min(streak / 10, 1) * 10;

  const total = topicScore + flashcardScore + dsaScore + consistencyScore;

  return {
    total: Math.round(total),
    breakdown: {
      topicCoverage: Math.round(topicScore),
      flashcardAccuracy: Math.round(flashcardScore),
      dsaPerformance: Math.round(dsaScore),
      consistency: Math.round(consistencyScore),
    },
  };
};

module.exports = { calculateReadinessScore, TOTAL_CORE_TOPICS };
