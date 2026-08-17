import { fetchJson } from './client.js';

export const loginWithGoogle = (payload = {}) =>
  fetchJson('/auth/google', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
