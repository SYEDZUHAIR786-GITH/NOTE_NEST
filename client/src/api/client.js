// Centralized API config & helpers

export const API_BASE = 'http://localhost:3001';

// ---- core fetch wrapper ----
export async function fetchJson(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = { ...options.headers };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const msg = data?.message || data?.error || `API Error ${response.status}`;
    throw new Error(msg);
  }

  return data;
}
