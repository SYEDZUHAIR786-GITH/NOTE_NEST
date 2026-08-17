import { fetchJson } from './client.js';

export const getAllNotes = () => fetchJson('/notes');

export const getNotesBySubject = (subjectId) =>
  fetchJson(`/notes/${encodeURIComponent(subjectId)}`);

export const uploadNote = (payload) => {
  if (payload instanceof FormData) {
    return fetchJson('/notes/upload', { method: 'POST', body: payload });
  }
  return fetchJson('/notes/upload', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const classifyNote = (payload) =>
  fetchJson('/notes/classify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
