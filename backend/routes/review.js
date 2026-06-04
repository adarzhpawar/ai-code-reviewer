const express = require('express');
const router = express.Router();
const { reviewCode } = require('../services/aiService');

const LANG_MAP = ['java', 'python', 'javascript', 'c++', 'c', 'typescript'];

router.post('/review', async (req, res) => {
  const t0 = Date.now();
  const { code, language } = req.body;

  console.log(`[${new Date().toISOString()}][Review Route] POST /api/review`);
  console.log(`[${new Date().toISOString()}][Review Route] Code received: ${(code || '').slice(0, 60)}...`);
  console.log(`[${new Date().toISOString()}][Review Route] Language: ${language}`);

  if (!code || !code.trim()) {
    console.log(`[${new Date().toISOString()}][Review Route] ERROR: Empty code`);
    return res.status(400).json({ error: 'Code is required' });
  }
  if (!language || !language.trim()) {
    console.log(`[${new Date().toISOString()}][Review Route] ERROR: Empty language`);
    return res.status(400).json({ error: 'Language is required' });
  }
  if (!LANG_MAP.includes(language.toLowerCase())) {
    console.log(`[${new Date().toISOString()}][Review Route] ERROR: Unsupported language: ${language}`);
    return res.status(400).json({ error: `Unsupported language. Supported: ${LANG_MAP.join(', ')}` });
  }

  try {
    console.log(`[${new Date().toISOString()}][Review Route] Sending request to Featherless AI...`);
    console.log(`[${new Date().toISOString()}][Review Route] Request payload:`, { codeLength: code.length, language });
    
    const result = await reviewCode(code, language);
    
    console.log(`[${new Date().toISOString()}][Review Route] Response received from Featherless`);
    console.log(`[${new Date().toISOString()}][Review Route] Total time: ${Date.now() - t0}ms`);
    console.log(`[${new Date().toISOString()}][Review Route] Response markdown length: ${(result.markdown || '').length} chars`);
    
    res.json({ ...result, language });
  } catch (error) {
    console.error(`[${new Date().toISOString()}][Review Route] ERROR: ${error.message}`);

    if (error.message?.includes('INVALID_API_KEY')) {
      return res.status(401).json({ error: 'Featherless API key is invalid. Please check backend/.env' });
    }
    if (error.message?.includes('RATE_LIMITED')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please wait and try again.' });
    }
    if (error.message?.includes('TIMEOUT')) {
      return res.status(504).json({ error: 'AI service timed out. Please try again.' });
    }

    res.status(500).json({
      error: 'AI review failed. Please try again.',
      _debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: !!process.env.FEATHERLESS_API_KEY,
    apiKeyLoaded: !!process.env.FEATHERLESS_API_KEY,
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    provider: 'Featherless AI',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
