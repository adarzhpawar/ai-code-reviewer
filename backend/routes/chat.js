const express = require('express');
const router = express.Router();
const { chatCompletion } = require('../services/aiService');

const CHAT_SYSTEM_PROMPT = `You are an AI coding mentor helping a student understand their code review. Be encouraging, clear, and educational.

You have access to:
1. The student's code
2. The AI review that was performed on it

Answer the student's follow-up questions about their code, the review, and general programming concepts.

Guidelines:
- Explain concepts in a beginner-friendly way.
- Use code examples when helpful.
- Reference specific lines in the student's code when relevant.
- Be encouraging and supportive.
- Format responses with proper markdown for readability.`;

function buildContext(code, language, reviewContext) {
  let context = `## Student's Code (${language})\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n`;
  if (!reviewContext) return context;

  context += `## AI Code Review Results\n\n`;
  if (reviewContext.summary) context += `**Summary:** ${reviewContext.summary}\n\n`;
  if (reviewContext.overallScore) context += `**Overall Score:** ${reviewContext.overallScore}/100\n\n`;

  if (reviewContext.issues?.length > 0) {
    context += `**Issues Found:**\n`;
    reviewContext.issues.forEach((issue, i) => {
      const desc = typeof issue === 'string' ? issue : issue.description || String(issue);
      const sev = typeof issue === 'object' ? issue.severity : 'medium';
      const line = typeof issue === 'object' && issue.line ? ` (Line ${issue.line})` : '';
      context += `${i + 1}. [${sev}] ${desc}${line}\n`;
    });
    context += '\n';
  }

  if (reviewContext.lineFeedback?.length > 0) {
    context += `**Line-by-Line Feedback:**\n`;
    reviewContext.lineFeedback.forEach((fb) => {
      context += `- Line ${fb.lineNumber} [${fb.severity}]: ${fb.issue}\n`;
    });
    context += '\n';
  }

  if (reviewContext.strengths?.length > 0) {
    context += `**Strengths:** ${reviewContext.strengths.join(', ')}\n\n`;
  }

  const timeC = reviewContext.complexityAnalysis?.timeComplexity || reviewContext.timeComplexity;
  const spaceC = reviewContext.complexityAnalysis?.spaceComplexity || reviewContext.spaceComplexity;
  if (timeC || spaceC) {
    context += `**Complexity:** Time=${timeC || 'Unknown'}, Space=${spaceC || 'Unknown'}\n\n`;
  }

  if (reviewContext.markdown) {
    context += `## Full Review Markdown\n\n${reviewContext.markdown.slice(0, 3000)}\n\n`;
  }

  return context;
}

router.post('/chat', async (req, res) => {
  const { message, code, language, reviewContext, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!code || !code.trim()) {
    return res.status(400).json({ error: 'Code context is required' });
  }

  const context = buildContext(code, language, reviewContext);

  const messages = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT },
    { role: 'system', content: `Here is the context for this conversation:\n\n${context}` },
  ];

  if (history && Array.isArray(history)) {
    history.forEach((msg) => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    });
  }

  messages.push({ role: 'user', content: message });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    await chatCompletion(messages, (delta, _fullText) => {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ error: `AI Chat Error: ${error.message}` });
    }
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  }
});

module.exports = router;
