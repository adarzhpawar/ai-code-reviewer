require('dotenv').config();
const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const reviewRoutes = require('../routes/review');
const fixCodeRoutes = require('../routes/fixCode');
const explainRoutes = require('../routes/explain');
const chatRoutes = require('../routes/chat');
const exportRoutes = require('../routes/export');
const learnRoutes = require('../routes/learn');
const testReviewRoutes = require('../routes/testReview');
const errorHandler = require('../middleware/errorHandler');
const { apiLimiter } = require('../middleware/rateLimiter');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:3006'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json({ limit: '5mb' }));

app.use(apiLimiter);

app.use(reviewRoutes);
app.use(fixCodeRoutes);
app.use(explainRoutes);
app.use(chatRoutes);
app.use(exportRoutes);
app.use(learnRoutes);
app.use(testReviewRoutes);

app.use(errorHandler);

// Export serverless handler
module.exports.handler = serverless(app);
