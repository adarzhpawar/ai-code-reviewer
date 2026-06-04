require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const reviewRoutes = require('./routes/review');
const fixCodeRoutes = require('./routes/fixCode');
const explainRoutes = require('./routes/explain');
const chatRoutes = require('./routes/chat');
const exportRoutes = require('./routes/export');
const learnRoutes = require('./routes/learn');
const testReviewRoutes = require('./routes/testReview');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:3006'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '5mb' }));

app.use('/api', apiLimiter);

app.use('/api', reviewRoutes);
app.use('/api', fixCodeRoutes);
app.use('/api', explainRoutes);
app.use('/api', chatRoutes);
app.use('/api', exportRoutes);
app.use('/api', learnRoutes);
app.use('/api', testReviewRoutes);

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${new Date().toISOString()}] CodeReview AI server running on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] AI Provider: Featherless AI (meta-llama/Meta-Llama-3.1-8B-Instruct)`);
  console.log(`[${new Date().toISOString()}] API Key configured: ${!!process.env.FEATHERLESS_API_KEY}`);
});
