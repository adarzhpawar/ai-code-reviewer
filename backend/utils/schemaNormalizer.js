/**
 * Centralized schema normalizers.
 * Every AI response goes through one of these before being returned to routes.
 * This prevents model-output shape changes from ever breaking the frontend.
 */

function normalizeReview(raw) {
  if (!raw || typeof raw !== 'object') {
    return getEmptyReview();
  }

  return {
    overallScore: clampScore(raw.overallScore),
    readabilityScore: clampScore(raw.readabilityScore),
    efficiencyScore: clampScore(raw.efficiencyScore),
    correctnessScore: clampScore(raw.correctnessScore),

    summary: typeof raw.summary === 'string' ? raw.summary : '',

    strengths: normalizeStringArray(raw.strengths),

    issues: (raw.issues || []).map(issue =>
      typeof issue === 'string'
        ? { description: issue, severity: 'medium', type: 'general', line: null }
        : {
            description: issue.description || String(issue),
            severity: issue.severity || 'medium',
            type: issue.type || 'general',
            line: issue.line || null,
          }
    ),

    improvements: (raw.improvements || []).map(item =>
      typeof item === 'string'
        ? { description: item, priority: 'medium' }
        : {
            description: item.description || String(item),
            priority: item.priority || 'medium',
          }
    ),

    complexityAnalysis: {
      timeComplexity:
        raw.timeComplexity ||
        raw.complexityAnalysis?.timeComplexity ||
        'Unknown',
      spaceComplexity:
        raw.spaceComplexity ||
        raw.complexityAnalysis?.spaceComplexity ||
        'Unknown',
    },

    lineFeedback: normalizeLineFeedback(raw.lineFeedback),
  };
}

function normalizeFix(raw) {
  if (!raw || typeof raw !== 'object') {
    return { improvedCode: '', changes: [], summary: 'No fix data available.' };
  }

  return {
    improvedCode: typeof raw.improvedCode === 'string' ? raw.improvedCode : '',
    changes: (raw.changes || []).map(c => ({
      change: c.change || c.description || String(c),
      reason: c.reason || '',
    })),
    summary: typeof raw.summary === 'string' ? raw.summary : '',
  };
}

function normalizeLearning(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    weakAreas: raw.weakAreas || [],
    recommendedTopics: raw.recommendedTopics || [],
    practiceQuestions: raw.practiceQuestions || [],
    learningPath: raw.learningPath || { steps: [], totalEstimatedTime: 'Unknown' },
    overallDifficulty: raw.overallDifficulty || 'intermediate',
    motivationalMessage: raw.motivationalMessage || 'Keep coding! Every line of code makes you better.',
  };
}

// ── helpers ──

function clampScore(val) {
  const n = Number(val);
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeStringArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(s => (typeof s === 'string' ? s : String(s)));
}

function normalizeLineFeedback(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(fb => ({
    lineNumber: fb.lineNumber || fb.line || 0,
    severity: fb.severity || 'suggestion',
    issue: fb.issue || fb.description || '',
    suggestion: fb.suggestion || fb.fix || '',
  }));
}

function getEmptyReview() {
  return {
    overallScore: 0,
    readabilityScore: 0,
    efficiencyScore: 0,
    correctnessScore: 0,
    summary: '',
    strengths: [],
    issues: [],
    improvements: [],
    complexityAnalysis: { timeComplexity: 'Unknown', spaceComplexity: 'Unknown' },
    lineFeedback: [],
  };
}

module.exports = { normalizeReview, normalizeFix, normalizeLearning, getEmptyReview };
