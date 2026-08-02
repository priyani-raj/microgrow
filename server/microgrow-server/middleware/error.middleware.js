const errorHandler = (err, req, res, next) => {
  // Handle Groq rate limit specifically
  if (err.status === 429 || err.message?.includes('rate limit')) {
    return res.status(429).json({
      message: 'AI is busy right now — please wait a moment and try again.',
      retryAfter: 10,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;