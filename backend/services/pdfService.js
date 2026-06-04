const PDFDocument = require('pdfkit');

const INDENT = 50;
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - INDENT * 2;
const PRIMARY = '#4F46E5';
const SECONDARY = '#8B5CF6';
const ACCENT = '#06B6D4';
const DARK_BG = '#0F172A';
const CARD_BG = '#1E293B';
const TEXT_PRIMARY = '#F8FAFC';
const TEXT_SECONDARY = '#94A3B8';
const GREEN = '#22C55E';
const RED = '#EF4444';
const YELLOW = '#F59E0B';
const BLUE = '#3B82F6';

function severityColor(severity) {
  switch (severity) {
    case 'critical': return RED;
    case 'warning': return YELLOW;
    case 'suggestion': return BLUE;
    case 'high': return RED;
    case 'medium': return YELLOW;
    case 'low': return BLUE;
    default: return TEXT_SECONDARY;
  }
}

function wrapText(doc, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split('\n');
  let currentY = y;

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line ? line + ' ' + word : word;
      const testWidth = doc.widthOfString(testLine);
      if (testWidth > maxWidth && line) {
        doc.text(line, x, currentY);
        currentY += lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      doc.text(line, x, currentY);
      currentY += lineHeight;
    }
    if (paragraph === '') currentY += lineHeight * 0.5;
  }

  return currentY;
}

function drawHeader(doc) {
  for (let i = 0; i < PAGE_HEIGHT; i += 2) {
    const alpha = Math.max(0, 0.06 * (1 - i / PAGE_HEIGHT));
    doc.fillColor(PRIMARY).opacity(alpha).rect(0, i, PAGE_WIDTH, 2).fill();
  }
  doc.opacity(1);

  doc.rect(0, 0, PAGE_WIDTH, 140).fill(DARK_BG, 0.95);

  doc.fillColor(PRIMARY).rect(0, 0, PAGE_WIDTH, 4).fill();
  doc.fillColor(SECONDARY).rect(0, 135, PAGE_WIDTH, 2).fill();

  doc.fontSize(32).font('Helvetica-Bold').fillColor('#FFFFFF');
  doc.text('CodeReview AI', INDENT, 35);

  doc.fontSize(12).font('Helvetica').fillColor(TEXT_SECONDARY);
  doc.text('Automated Code Review Report', INDENT, 75);

  doc.fontSize(9).fillColor(TEXT_SECONDARY);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, INDENT, 100);

  doc.fontSize(9).fillColor(TEXT_SECONDARY);
  doc.text('Powered by AI • Featherless', INDENT, 118);

  return 150;
}

function drawSectionTitle(doc, y, title, color = PRIMARY) {
  doc.fillColor(color).fontSize(16).font('Helvetica-Bold');
  const titleWidth = doc.widthOfString(title);
  doc.text(title, INDENT, y);

  doc.fillColor(color).opacity(0.3).rect(INDENT, y + 22, CONTENT_WIDTH, 1).fill();
  doc.opacity(1);

  return y + 34;
}

function drawScoreCircle(doc, cx, cy, radius, score, label) {
  const colors = score >= 80 ? PRIMARY : score >= 60 ? SECONDARY : score >= 40 ? YELLOW : RED;
  const percentage = score / 100;

  doc.circle(cx, cy, radius).fill(CARD_BG);

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + 2 * Math.PI * percentage;

  doc.lineWidth(6);
  doc.strokeColor(colors);

  for (let a = startAngle; a < endAngle; a += 0.05) {
    const px = cx + (radius - 3) * Math.cos(a);
    const py = cy + (radius - 3) * Math.sin(a);
    doc.circle(px, py, 2.5).fill();
  }

  doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold');
  doc.text(String(score), cx - 10, cy - 10, { width: 20, align: 'center' });

  doc.fillColor(TEXT_SECONDARY).fontSize(8).font('Helvetica');
  doc.text(label, cx - 25, cy + 15, { width: 50, align: 'center' });
}

function drawScoreCard(doc, y, scores) {
  doc.roundedRect(INDENT, y, CONTENT_WIDTH, 110, 8).fill(CARD_BG);
  y += 15;

  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold');
  doc.text('Score Overview', INDENT + 15, y);

  doc.fillColor(TEXT_SECONDARY).fontSize(10).font('Helvetica');
  doc.text(`Overall: ${scores.overallScore}/100`, INDENT + 15, y + 20);

  const chartY = y + 45;
  const cols = [
    { label: 'Readability', score: scores.readabilityScore },
    { label: 'Efficiency', score: scores.efficiencyScore },
    { label: 'Correctness', score: scores.correctnessScore },
  ];

  const colWidth = CONTENT_WIDTH / cols.length;
  cols.forEach((col, i) => {
    const cx = INDENT + colWidth * i + colWidth / 2;
    drawScoreCircle(doc, cx, chartY + 20, 22, col.score, col.label);
  });

  return y + 110 + 10;
}

function drawSummarySection(doc, y, summary) {
  if (!summary) return y;
  y = drawSectionTitle(doc, y, 'AI Summary');
  doc.fillColor(TEXT_SECONDARY).fontSize(10).font('Helvetica');
  y = wrapText(doc, summary, INDENT, y, CONTENT_WIDTH, 16);
  return y + 10;
}

function drawStrengthsSection(doc, y, strengths) {
  if (!strengths || strengths.length === 0) return y;
  y = drawSectionTitle(doc, y, 'Strengths', GREEN);
  strengths.forEach((s) => {
    doc.fillColor(GREEN).fontSize(10).font('Helvetica');
    doc.text('\u25CF  ', INDENT, y, { continued: true });
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').text(s, INDENT + 14, y);
    y += 18;
  });
  return y + 8;
}

function drawIssuesSection(doc, y, issues) {
  if (!issues || issues.length === 0) return y;
  y = drawSectionTitle(doc, y, 'Issues Found', RED);
  issues.forEach((issue) => {
    doc.fillColor(RED).fontSize(10).font('Helvetica');
    doc.text('\u25CF  ', INDENT, y, { continued: true });
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').text(issue, INDENT + 14, y);
    y += 18;
  });
  return y + 8;
}

function drawImprovementsSection(doc, y, improvements) {
  if (!improvements || improvements.length === 0) return y;
  y = drawSectionTitle(doc, y, 'Improvements', PRIMARY);
  improvements.forEach((imp) => {
    doc.fillColor(PRIMARY).fontSize(10).font('Helvetica');
    doc.text('\u25CF  ', INDENT, y, { continued: true });
    doc.fillColor(TEXT_SECONDARY).font('Helvetica').text(imp, INDENT + 14, y);
    y += 18;
  });
  return y + 8;
}

function drawComplexitySection(doc, y, complexity) {
  if (!complexity) return y;
  y = drawSectionTitle(doc, y, 'Complexity Analysis', ACCENT);

  const colW = (CONTENT_WIDTH - 10) / 2;
  doc.roundedRect(INDENT, y, colW, 40, 4).fill(CARD_BG);
  doc.fillColor(ACCENT).fontSize(10).font('Helvetica-Bold');
  doc.text('Time: ' + complexity.timeComplexity, INDENT + 10, y + 13);

  doc.roundedRect(INDENT + colW + 10, y, colW, 40, 4).fill(CARD_BG);
  doc.fillColor(SECONDARY).fontSize(10).font('Helvetica-Bold');
  doc.text('Space: ' + complexity.spaceComplexity, INDENT + colW + 20, y + 13);

  y += 50;
  if (complexity.explanation) {
    doc.fillColor(TEXT_SECONDARY).fontSize(9).font('Helvetica');
    y = wrapText(doc, complexity.explanation, INDENT, y, CONTENT_WIDTH, 14);
  }
  return y + 10;
}

function drawCodeBlock(doc, y, code, label) {
  if (!code || code.trim().length === 0) return y;
  doc.addPage();
  y = 40;

  doc.fillColor(PRIMARY).rect(0, 0, PAGE_WIDTH, 50).fill();
  doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold');
  doc.text(label, INDENT, 16);

  const lines = code.split('\n');
  const maxLines = Math.min(lines.length, 60);
  const lineH = 11;
  const codeStartY = 70;

  doc.roundedRect(INDENT - 5, codeStartY - 5, CONTENT_WIDTH + 10, maxLines * lineH + 10, 4).fill(CARD_BG);

  const keywords = {
    javascript: ['function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined'],
    python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'raise', 'with', 'async', 'await', 'True', 'False', 'None', 'in', 'not', 'and', 'or'],
    java: ['public', 'private', 'protected', 'class', 'static', 'void', 'int', 'String', 'boolean', 'double', 'float', 'long', 'return', 'if', 'else', 'for', 'while', 'do', 'try', 'catch', 'throw', 'throws', 'new', 'this', 'super', 'import', 'package', 'true', 'false', 'null', 'final'],
    default: ['function', 'class', 'return', 'if', 'else', 'for', 'while', 'import', 'const', 'let', 'var', 'true', 'false', 'null'],
  };

  const langKeywords = keywords[code.toLowerCase()] || keywords.default;

  for (let i = 0; i < maxLines; i++) {
    const line = lines[i];
    const ly = codeStartY + i * lineH;

    doc.fillColor('#333').fontSize(7).font('Helvetica');
    doc.text(String(i + 1).padStart(3, ' '), INDENT, ly);

    if (line) {
      const words = line.split(/(\s+|\b)/);
      let xPos = INDENT + 24;

      for (const word of words) {
        if (word.trim() === '') {
          xPos += doc.widthOfString(word);
          continue;
        }
        const isComment = line.trim().startsWith('//') || line.trim().startsWith('#');
        const isKeyword = langKeywords.includes(word);
        const isString = (word.startsWith("'") && word.endsWith("'")) || (word.startsWith('"') && word.endsWith('"'));
        const isNumber = /^\d+$/.test(word);

        doc.fontSize(8).font('Courier');
        if (isComment) {
          doc.fillColor('#6B7280');
        } else if (isKeyword) {
          doc.fillColor('#818CF8');
        } else if (isString) {
          doc.fillColor('#34D399');
        } else if (isNumber) {
          doc.fillColor('#F472B6');
        } else {
          doc.fillColor('#E2E8F0');
        }

        doc.text(word, xPos, ly);
        xPos += doc.widthOfString(word);
      }
    }
  }

  return codeStartY + maxLines * lineH + 20;
}

function drawLineFeedbackSection(doc, y, lineFeedback) {
  if (!lineFeedback || lineFeedback.length === 0) return y;

  if (y > PAGE_HEIGHT - 100) {
    doc.addPage();
    y = 40;
  }

  y = drawSectionTitle(doc, y, 'Line-by-Line Feedback', ACCENT);

  const colWidths = [25, 50, CONTENT_WIDTH - 75];
  const headerY = y;

  doc.roundedRect(INDENT, headerY, CONTENT_WIDTH, 22, 4).fill(CARD_BG);
  doc.fillColor(TEXT_SECONDARY).fontSize(8).font('Helvetica-Bold');
  doc.text('Line', INDENT + 6, headerY + 6, { width: colWidths[0] });
  doc.text('Severity', INDENT + colWidths[0] + 6, headerY + 6, { width: colWidths[1] });
  doc.text('Issue', INDENT + colWidths[0] + colWidths[1] + 6, headerY + 6, { width: colWidths[2] });

  y = headerY + 26;

  lineFeedback.forEach((fb) => {
    if (y > PAGE_HEIGHT - 40) {
      doc.addPage();
      y = 40;
    }

    const color = severityColor(fb.severity);
    doc.fillColor(color).opacity(0.1).rect(INDENT, y, CONTENT_WIDTH, 20).fill();
    doc.opacity(1);

    doc.fillColor('#FFFFFF').fontSize(8).font('Courier');
    doc.text(String(fb.lineNumber), INDENT + 6, y + 4, { width: colWidths[0] });

    doc.fillColor(color).fontSize(8).font('Helvetica-Bold');
    doc.text(fb.severity.toUpperCase(), INDENT + colWidths[0] + 6, y + 4, { width: colWidths[1] });

    doc.fillColor(TEXT_SECONDARY).fontSize(8).font('Helvetica');
    doc.text(fb.issue, INDENT + colWidths[0] + colWidths[1] + 6, y + 4, { width: colWidths[2] - 6 });

    y += 22;
  });

  return y + 12;
}

function drawFooter(doc) {
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    doc.fillColor(TEXT_SECONDARY).fontSize(7).font('Helvetica');
    doc.text(`CodeReview AI  |  Page ${i + 1} of ${totalPages}`, INDENT, PAGE_HEIGHT - 30, { width: CONTENT_WIDTH, align: 'center' });
  }
}

async function generateReviewPDF(reviewData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 0, bottom: 40, left: 0, right: 0 },
        info: {
          Title: 'CodeReview AI - Automated Code Review Report',
          Author: 'CodeReview AI',
          Subject: 'Code Review Report',
        },
        bufferPages: true,
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      let y = drawHeader(doc);
      y = drawScoreCard(doc, y + 10, reviewData);
      y = drawSummarySection(doc, y + 10, reviewData.summary);

      if (y > PAGE_HEIGHT - 200) {
        doc.addPage();
        y = 40;
      }

      y = drawStrengthsSection(doc, y + 5, reviewData.strengths);

      if (y > PAGE_HEIGHT - 200) {
        doc.addPage();
        y = 40;
      }

      y = drawIssuesSection(doc, y + 5, reviewData.issues);

      if (y > PAGE_HEIGHT - 200) {
        doc.addPage();
        y = 40;
      }

      y = drawImprovementsSection(doc, y + 5, reviewData.improvements);

      if (y > PAGE_HEIGHT - 200) {
        doc.addPage();
        y = 40;
      }

      y = drawComplexitySection(doc, y + 5, reviewData.complexityAnalysis);

      if (y > PAGE_HEIGHT - 200) {
        doc.addPage();
        y = 40;
      }

      y = drawLineFeedbackSection(doc, y + 5, reviewData.lineFeedback);

      drawCodeBlock(doc, 0, reviewData.improvedCode, 'Improved Code');

      drawFooter(doc);
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateReviewPDF };
