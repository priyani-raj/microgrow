// Updates a user's streak based on their last active date.
// Call this whenever a user completes a session.

const updateStreak = (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = user.streak.lastActiveDate
    ? new Date(user.streak.lastActiveDate)
    : null;

  if (lastActive) {
    lastActive.setHours(0, 0, 0, 0);
  }

  if (!lastActive) {
    // First ever session
    user.streak.current = 1;
  } else {
    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Already active today, no change to streak count
    } else if (diffDays === 1) {
      // Consecutive day
      user.streak.current += 1;
    } else {
      // Streak broken, restart
      user.streak.current = 1;
    }
  }

  if (user.streak.current > user.streak.longest) {
    user.streak.longest = user.streak.current;
  }

  user.streak.lastActiveDate = today;

  return user;
};

module.exports = { updateStreak };
