import { fetchJson } from './client.js';

export const getColleges = () => fetchJson('/colleges');

export const getDepartments = (collegeId) =>
  fetchJson(`/departments/${encodeURIComponent(collegeId)}`);

export const getSubjects = (deptId) =>
  fetchJson(`/subjects/${encodeURIComponent(deptId)}`);
