const express = require('express');
const router = express.Router();
const { generateLearning } = require('../services/aiService');

function buildReviewContext(review) {
  if (!review) return '';
  let context = '';

  context += `## Review Scores\n`;
  if (review.overallScore != null) context += `- Overall: ${review.overallScore}/100\n`;
  if (review.readabilityScore != null) context += `- Readability: ${review.readabilityScore}/100\n`;
  if (review.efficiencyScore != null) context += `- Efficiency: ${review.efficiencyScore}/100\n`;
  if (review.correctnessScore != null) context += `- Correctness: ${review.correctnessScore}/100\n\n`;

  if (review.issues?.length > 0) {
    context += `## Issues Found\n`;
    review.issues.forEach((issue) => {
      const desc = typeof issue === 'string' ? issue : issue.description || String(issue);
      const sev = typeof issue === 'object' ? issue.severity : 'medium';
      const line = typeof issue === 'object' && issue.line ? ` (line ${issue.line})` : '';
      context += `- [${sev}]: ${desc}${line}\n`;
    });
    context += '\n';
  }

  if (review.lineFeedback?.length > 0) {
    context += `## Line-by-Line Issues\n`;
    review.lineFeedback.slice(0, 10).forEach((fb) => {
      context += `- Line ${fb.lineNumber} [${fb.severity}]: ${fb.issue}\n`;
    });
    context += '\n';
  }

  const timeC = review.complexityAnalysis?.timeComplexity || review.timeComplexity;
  const spaceC = review.complexityAnalysis?.spaceComplexity || review.spaceComplexity;
  if (timeC || spaceC) {
    context += `## Complexity\n`;
    context += `- Time: ${timeC || 'Unknown'}\n`;
    context += `- Space: ${spaceC || 'Unknown'}\n\n`;
  }

  if (review.strengths?.length > 0) {
    context += `## Strengths\n`;
    review.strengths.forEach((s) => context += `- ${s}\n`);
    context += '\n';
  }

  if (review.markdown) {
    context += `## Full Review\n${review.markdown.slice(0, 3000)}\n\n`;
  }

  return context;
}

router.post('/learn/recommend', async (req, res) => {
  const { code, language, review } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code is required' });
  }

  if (!review) {
    return res.status(400).json({ error: 'Review data is required' });
  }

  try {
    const reviewContext = buildReviewContext(review);
    const result = await generateLearning(code, language, reviewContext);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
