const express = require('express');
const router = express.Router();
const { explainIssue } = require('../services/aiService');

const LANG_MAP = ['java', 'python', 'javascript', 'c++', 'c', 'typescript'];

router.post('/explain', async (req, res) => {
  const { code, language, issue } = req.body;

  if (!code || !code.trim()) return res.status(400).json({ error: 'Code is required' });
  if (!issue) return res.status(400).json({ error: 'Issue description is required' });
  if (!language || !LANG_MAP.includes(language.toLowerCase())) {
    return res.status(400).json({ error: 'Valid language is required' });
  }

  try {
    const result = await explainIssue(code, language, issue);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
