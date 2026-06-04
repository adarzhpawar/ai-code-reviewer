const express = require('express');
const router = express.Router();
const { fixCode } = require('../services/aiService');

const LANG_MAP = ['java', 'python', 'javascript', 'c++', 'c', 'typescript'];

router.post('/fix-code', async (req, res) => {
  const t0 = Date.now();
  const { code, language } = req.body;

  console.log(`[${new Date().toISOString()}][FixCode Route] POST /api/fix-code`);
  console.log(`[${new Date().toISOString()}][FixCode Route] Code length: ${code?.length}`);

  if (!code || !code.trim()) return res.status(400).json({ error: 'Code is required' });
  if (!language || !language.trim()) return res.status(400).json({ error: 'Language is required' });
  if (!LANG_MAP.includes(language.toLowerCase())) {
    return res.status(400).json({ error: `Unsupported language. Supported: ${LANG_MAP.join(', ')}` });
  }

  try {
    const result = await fixCode(code, language);
    console.log(`[${new Date().toISOString()}][FixCode Route] Completed in ${Date.now() - t0}ms`);
    res.json({ ...result, originalCode: code, language });
  } catch (error) {
    console.error(`[${new Date().toISOString()}][FixCode Route] ERROR: ${error.message}`);
    if (error.message?.includes('INVALID_API_KEY')) {
      return res.status(401).json({ error: 'API key invalid' });
    }
    if (error.message?.includes('RATE_LIMITED')) {
      return res.status(429).json({ error: 'Rate limited' });
    }
    res.status(500).json({ error: 'Fix code failed. Please try again.' });
  }
});

module.exports = router;
