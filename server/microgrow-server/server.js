require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/session', require('./routes/session.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/flashcards', require('./routes/flashcard.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/dsa', require('./routes/dsa.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'MicroGrow API is running 🚀' });
});

// Error handler (keep this last)
app.use(require('./middleware/error.middleware'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
