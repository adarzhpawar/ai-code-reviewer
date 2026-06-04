const API_URL = import.meta.env.VITE_API_URL || '/api';

const inflight = new Map();
const cache = new Map();

async function dedupFetch(key, factory) {
  if (cache.has(key)) return cache.get(key);
  const existing = inflight.get(key);
  if (existing) return existing;
  const promise = factory().then(r => { cache.set(key, r); return r; }).finally(() => inflight.delete(key));
  inflight.set(key, promise);
  return promise;
}

export async function reviewCode(code, language) {
  return dedupFetch(`review:${code.slice(0,100)}:${language}`, async () => {
    const response = await fetch(`${API_URL}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to review code');
    }
    return response.json();
  });
}

export async function fixCode(code, language) {
  return dedupFetch(`fix:${code.slice(0,100)}:${language}`, async () => {
    const response = await fetch(`${API_URL}/fix-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fix code');
    }
    return response.json();
  });
}

export async function explainIssue(code, language, issue) {
  const response = await fetch(`${API_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language, issue }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get explanation');
  }
  return response.json();
}

export async function sendChatMessage({ message, code, language, reviewContext, history }, onChunk) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, code, language, reviewContext, history }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Chat request failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      try {
        const data = JSON.parse(trimmed.slice(6));
        if (data.done) return fullText;
        // Handle delta-based streaming (new) and text-based (legacy)
        if (data.delta) {
          fullText += data.delta;
          onChunk(fullText);
        } else if (data.text) {
          fullText += data.text;
          onChunk(fullText);
        }
      } catch {
        // skip malformed JSON
      }
    }
  }

  return fullText;
}

export async function exportPDF(review, code, language) {
  const response = await fetch(`${API_URL}/export/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review, code, language }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'PDF export failed');
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codereview-report-${new Date().toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function recommendLearning(code, language, review) {
  const response = await fetch(`${API_URL}/learn/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language, review }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate recommendations');
  }

  return response.json();
}

export async function healthCheck() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}
