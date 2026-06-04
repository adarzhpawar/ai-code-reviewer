const express = require('express');
const router = express.Router();
const { generateReviewPDF } = require('../services/pdfService');

router.post('/export/pdf', async (req, res) => {
  const { review, code, language } = req.body;

  if (!review) {
    return res.status(400).json({ error: 'Review data is required' });
  }

  try {
    const reviewData = {
      ...review,
      code: code || '',
      language: language || 'javascript',
    };

    const pdfBuffer = await generateReviewPDF(reviewData);

    const date = new Date().toISOString().split('T')[0];
    const filename = `codereview-report-${date}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: `PDF generation failed: ${error.message}` });
  }
});

module.exports = router;
