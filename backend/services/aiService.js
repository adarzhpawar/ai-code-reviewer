const { OpenAI } = require('openai');

const API_TIMEOUT = 60000;
const MODEL = 'meta-llama/Meta-Llama-3.1-8B-Instruct';

const LANG_MAP = ['java', 'python', 'javascript', 'c++', 'c', 'typescript'];

function getClient() {
  const key = process.env.FEATHERLESS_API_KEY;
  if (!key) throw new Error('MISSING_API_KEY: FEATHERLESS_API_KEY is not set in backend/.env');
  return new OpenAI({
    apiKey: key,
    baseURL: 'https://api.featherless.ai/v1',
    timeout: API_TIMEOUT,
  });
}

const REVIEW_SYSTEM_PROMPT = `You are a senior software engineer performing a professional code review.

Analyze the submitted code and provide:

1. Overall Quality Score (1-10)
2. Bugs and Errors
3. Security Issues
4. Performance Improvements
5. Code Style Issues
6. Best Practices
7. Refactored Suggestions
8. Final Summary

Use markdown formatting.`;

const FIX_CODE_SYSTEM_PROMPT = `You are an expert code refactoring assistant. 
Analyze the code and provide:
1. The full refactored code in a code block
2. A list of changes made and why
3. A brief summary

Use markdown formatting. Format with clear sections.`;

const EXPLAIN_SYSTEM_PROMPT = `You are an expert code reviewer explaining a specific issue.
Provide:
1. A clear explanation of the issue (2-3 sentences)
2. A code example showing how to fix it
3. The concept name for further learning

Use markdown formatting.`;

const CHAT_SYSTEM_PROMPT = `You are an AI coding mentor helping a student understand their code review. Be encouraging, clear, and educational.

You have access to the student's code and the AI review that was performed on it.

Answer the student's follow-up questions about their code, the review, and general programming concepts.

Guidelines:
- Explain concepts in a beginner-friendly way.
- Use code examples when helpful.
- Reference specific lines in the student's code when relevant.
- Be encouraging and supportive.
- Format responses with proper markdown for readability.`;

const LEARNING_SYSTEM_PROMPT = `You are an AI learning advisor. Based on the code and review provided, generate learning recommendations. Provide:
1. Weak areas identified in the code
2. Recommended topics to study
3. Practice questions
4. A learning path with steps
5. Overall difficulty assessment
6. An encouraging motivational message

Use markdown formatting.`;

function log(service, message, data = null) {
  const ts = new Date().toISOString();
  const prefix = `[${ts}][AI Service][${service}]`;
  if (data) {
    console.log(`${prefix} ${message}`, typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  } else {
    console.log(`${prefix} ${message}`);
  }
}

function logError(service, message, error = null) {
  const ts = new Date().toISOString();
  console.error(`[${ts}][AI Service][${service}] ERROR: ${message}`);
  if (error) console.error(`[${ts}][AI Service][${service}]`, error.message || error);
}

async function createCompletion(messages, options = {}) {
  const { temperature = 0.2, maxTokens = 2048 } = options;
  log('createCompletion', `Sending request with ${messages.length} messages, model=${MODEL}`);
  
  try {
    const client = getClient();
    const response = await client.chat.completions.create({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });
    
    log('createCompletion', 'Response received');
    const content = response.choices[0]?.message?.content || '';
    log('createCompletion', `Response length: ${content.length} chars`);
    return content;
  } catch (error) {
    logError('createCompletion', 'API call failed', error);
    if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Incorrect API key')) {
      throw new Error('INVALID_API_KEY: Featherless API key is invalid. Please check backend/.env');
    }
    if (error.status === 429 || error.message?.includes('429')) {
      throw new Error('RATE_LIMITED: API rate limit exceeded. Please wait and try again.');
    }
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error('TIMEOUT: AI service timed out. Please try again.');
    }
    throw new Error(`AI_SERVICE_ERROR: ${error.message}`);
  }
}

function extractScore(markdown) {
  const match = markdown.match(/(?:Overall\s+(?:Quality\s+)?Score|Score)[^\d]*(\d+)(?:\s*\/\s*10)?/i);
  if (match) {
    const score = parseInt(match[1], 10);
    return Math.max(0, Math.min(100, score * 10));
  }
  return 75;
}

function extractIssues(markdown) {
  const issues = [];
  const sections = ['Bugs and Errors', 'Security Issues', 'Code Style Issues', 'Performance Improvements'];
  
  for (const section of sections) {
    const regex = new RegExp(`(?:##\\s*)?\\*?\\*?${section}\\*?\\*?[^\\n]*\\n([\\s\\S]*?)(?=\\n(?:##|\\*?\\*?\\d+\\.|$))`, 'i');
    const match = markdown.match(regex);
    if (match) {
      const lines = match[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'));
      lines.forEach(line => {
        const text = line.replace(/^[\s*\-]+/, '').trim();
        if (text) issues.push(text);
      });
    }
  }
  
  return issues.length > 0 ? issues.slice(0, 10) : ['Review generated - check markdown for full details'];
}

async function reviewCode(code, language) {
  log('reviewCode', `Starting review for ${language} code (${code.length} chars)`);
  const t0 = Date.now();
  
  if (!code || !code.trim()) throw new Error('Code is required for review');
  if (!language || !LANG_MAP.includes(language.toLowerCase())) {
    throw new Error(`Unsupported language. Supported: ${LANG_MAP.join(', ')}`);
  }
  
  const messages = [
    { role: 'system', content: REVIEW_SYSTEM_PROMPT },
    { role: 'user', content: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
  ];
  
  try {
    const content = await createCompletion(messages, { temperature: 0.2, maxTokens: 2048 });
    const elapsed = Date.now() - t0;
    log('reviewCode', `Completed in ${elapsed}ms`);
    
    return {
      markdown: content,
      overallScore: extractScore(content),
      issues: extractIssues(content),
      improvements: [],
      timeComplexity: 'See markdown',
      spaceComplexity: 'See markdown',
      summary: content.slice(0, 500),
      strengths: [],
      complexityAnalysis: { timeComplexity: 'See markdown', spaceComplexity: 'See markdown' },
      lineFeedback: [],
      language,
    };
  } catch (error) {
    logError('reviewCode', 'Review failed', error);
    throw error;
  }
}

async function fixCode(code, language) {
  log('fixCode', `Starting fix for ${language} code (${code.length} chars)`);
  const t0 = Date.now();
  
  const messages = [
    { role: 'system', content: FIX_CODE_SYSTEM_PROMPT },
    { role: 'user', content: `Please refactor this ${language} code and explain the changes:\n\n\`\`\`${language}\n${code}\n\`\`\`` },
  ];
  
  try {
    const content = await createCompletion(messages, { temperature: 0.2, maxTokens: 4096 });
    const elapsed = Date.now() - t0;
    log('fixCode', `Completed in ${elapsed}ms`);
    
    const codeBlockMatch = content.match(/```(?:\w+)?\n([\s\S]*?)```/);
    const improvedCode = codeBlockMatch ? codeBlockMatch[1].trim() : '// See fix description above';
    
    return {
      improvedCode,
      changes: [{ change: 'See markdown response', reason: 'Full details in markdown above' }],
      summary: content.slice(0, 300),
      markdown: content,
    };
  } catch (error) {
    logError('fixCode', 'Fix failed', error);
    throw error;
  }
}

async function explainIssue(code, language, issue) {
  log('explainIssue', `Explaining issue in ${language} code`);
  
  const messages = [
    { role: 'system', content: EXPLAIN_SYSTEM_PROMPT },
    { role: 'user', content: `Code (${language}):\n\`\`\`${language}\n${code}\n\`\`\`\n\nExplain this issue: ${issue}` },
  ];
  
  try {
    const content = await createCompletion(messages, { temperature: 0.3, maxTokens: 1024 });
    return { explanation: content, fixExample: '', resourceLink: '' };
  } catch (error) {
    logError('explainIssue', 'Explain failed', error);
    return { explanation: 'Unable to get explanation. AI service error.', fixExample: '', resourceLink: '' };
  }
}

async function chatCompletion(messages, onChunk) {
  log('chatCompletion', `Starting stream with ${messages.length} messages`);
  const t0 = Date.now();
  
  const systemMsg = { role: 'system', content: CHAT_SYSTEM_PROMPT };
  const apiMessages = [systemMsg, ...messages];
  
  try {
    const client = getClient();
    const stream = await client.chat.completions.create({
      model: MODEL,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    });
    
    let fullText = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullText += delta;
        if (onChunk) onChunk(delta, fullText);
      }
    }
    
    const elapsed = Date.now() - t0;
    log('chatCompletion', `Stream completed in ${elapsed}ms, total chars: ${fullText.length}`);
    return fullText;
  } catch (error) {
    logError('chatCompletion', 'Chat stream failed', error);
    if (onChunk) onChunk('AI service error. Please check your API configuration.', '');
    return '';
  }
}

async function generateLearning(code, language, reviewContext) {
  log('generateLearning', `Generating learning for ${language} code`);
  
  const contextStr = typeof reviewContext === 'string' 
    ? reviewContext 
    : JSON.stringify(reviewContext || {});
  
  const messages = [
    { role: 'system', content: LEARNING_SYSTEM_PROMPT },
    { role: 'user', content: `## Code (${language})\n\`\`\`${language}\n${code}\n\`\`\`\n\n## Review Context\n${contextStr}\n\nGenerate learning recommendations.` },
  ];
  
  try {
    const content = await createCompletion(messages, { temperature: 0.3, maxTokens: 2048 });
    return {
      weakAreas: [{ area: 'See recommendations', description: content.slice(0, 200), severity: 'intermediate' }],
      recommendedTopics: [{ topic: 'Review feedback', reason: 'Based on code analysis', difficulty: 'intermediate' }],
      practiceQuestions: [],
      learningPath: { steps: [], totalEstimatedTime: 'See markdown' },
      overallDifficulty: 'intermediate',
      motivationalMessage: 'Keep coding! Review the recommendations above.',
      markdown: content,
    };
  } catch (error) {
    logError('generateLearning', 'Learning generation failed', error);
    throw error;
  }
}

module.exports = { reviewCode, fixCode, explainIssue, chatCompletion, generateLearning };
