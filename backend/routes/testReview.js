const express = require('express');
const router = express.Router();
const { reviewCode } = require('../services/aiService');

router.post('/test-review', async (req, res) => {
  console.log(`[${new Date().toISOString()}][Test Review] Starting test...`);
  const t0 = Date.now();

  const testCode = req.body?.code || 'function hello(name) {\n  console.log("Hello " + name);\n}\n\nhello("World");';
  const testLang = req.body?.language || 'javascript';

  const envStatus = {
    apiKeyExists: !!process.env.FEATHERLESS_API_KEY,
    apiKeyLength: process.env.FEATHERLESS_API_KEY?.length || 0,
    apiUrl: 'https://api.featherless.ai/v1',
    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    provider: 'Featherless AI',
  };

  console.log(`[${new Date().toISOString()}][Test Review] Env:`, JSON.stringify({ ...envStatus, apiKey: envStatus.apiKeyExists ? '***' : 'MISSING' }));

  if (!envStatus.apiKeyExists) {
    return res.json({
      success: false,
      error: 'FEATHERLESS_API_KEY is not set in backend/.env',
      envStatus,
      elapsed: Date.now() - t0,
    });
  }

  try {
    const result = await reviewCode(testCode, testLang);
    console.log(`[${new Date().toISOString()}][Test Review] SUCCESS in ${Date.now() - t0}ms`);
    res.json({
      success: true,
      elapsed: Date.now() - t0,
      result: result,
      envStatus: { ...envStatus, apiKey: '***' },
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}][Test Review] FAILED: ${error.message}`);
    res.json({
      success: false,
      error: error.message,
      elapsed: Date.now() - t0,
      envStatus: { ...envStatus, apiKey: '***' },
    });
  }
});

module.exports = router;
