import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database path at server/notenest.db
const dbPath = path.resolve(__dirname, '../../notenest.db');
const schemaPath = path.resolve(__dirname, 'schema.sql');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize Database Schema
export function initDb() {
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);

  // Seed sample data if colleges is empty
  const collegeCount = db.prepare('SELECT COUNT(*) as count FROM colleges').get().count;
  if (collegeCount === 0) {
    seedDb();
  }
}

function seedDb() {
  const insertCollege = db.prepare('INSERT INTO colleges (id, name, code) VALUES (?, ?, ?)');
  const insertDept = db.prepare('INSERT INTO departments (id, college_id, name, code) VALUES (?, ?, ?, ?)');
  const insertSubject = db.prepare('INSERT INTO subjects (id, dept_id, name, subject_code) VALUES (?, ?, ?, ?)');
  const insertUser = db.prepare('INSERT INTO users (id, google_id, email, name, college_id, dept_id) VALUES (?, ?, ?, ?, ?, ?)');

  db.transaction(() => {
    // 1. Seed Colleges
    insertCollege.run('col-mit', 'MIT Institute of Technology', 'MIT');
    insertCollege.run('col-stanford', 'Stanford School of Engineering', 'STAN');
    insertCollege.run('col-berkeley', 'UC Berkeley College of Computing', 'UCB');

    // 2. Seed Departments
    insertDept.run('dept-mit-cs', 'col-mit', 'Computer Science & AI', 'CS');
    insertDept.run('dept-mit-ee', 'col-mit', 'Electrical Engineering', 'EE');
    insertDept.run('dept-mit-me', 'col-mit', 'Mechanical Engineering', 'ME');

    insertDept.run('dept-stan-cs', 'col-stanford', 'Computer Science', 'CS');
    insertDept.run('dept-stan-bio', 'col-stanford', 'Bioengineering', 'BIO');

    insertDept.run('dept-ucb-eecs', 'col-berkeley', 'EECS', 'EECS');
    insertDept.run('dept-ucb-ds', 'col-berkeley', 'Data Science', 'DS');

    // 3. Seed Subjects (with subject_code)
    insertSubject.run('sub-mit-cs101', 'dept-mit-cs', 'Intro to Computer Science & Algorithms', 'CS101');
    insertSubject.run('sub-mit-cs201', 'dept-mit-cs', 'Data Structures & Algorithms', 'CS201');
    insertSubject.run('sub-mit-cs301', 'dept-mit-cs', 'Database Systems & Architecture', 'CS301');
    insertSubject.run('sub-mit-ee101', 'dept-mit-ee', 'Circuit Analysis & Signals', 'EE101');

    insertSubject.run('sub-stan-cs106', 'dept-stan-cs', 'Programming Methodology', 'CS106A');
    insertSubject.run('sub-stan-cs229', 'dept-stan-cs', 'Machine Learning & Neural Nets', 'CS229');

    insertSubject.run('sub-ucb-cs61a', 'dept-ucb-eecs', 'Structure & Interpretation of Computer Programs', 'CS61A');
    insertSubject.run('sub-ucb-ds100', 'dept-ucb-ds', 'Principles & Techniques of Data Science', 'DATA100');

    // 4. Seed Demo User
    insertUser.run('usr-demo', 'g-123456789', 'student@notenest.edu', 'Alex Rivera', 'col-mit', 'dept-mit-cs');

    // Notes are NOT seeded — the app starts with zero notes.
    // Users upload real notes through the /notes/upload endpoint.
  })();

  console.log('Database seeded: colleges, departments, subjects and demo user ready. No pre-loaded notes.');
}
