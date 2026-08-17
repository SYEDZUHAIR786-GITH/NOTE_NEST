-- SQLite Schema for NoteNest

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    google_id TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    college_id TEXT,
    dept_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS colleges (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    college_id TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id TEXT PRIMARY KEY,
    dept_id TEXT NOT NULL,
    name TEXT NOT NULL,
    subject_code TEXT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT,
    file_path TEXT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    classification_method TEXT DEFAULT 'manual',
    summary TEXT,
    tags TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS note_shares (
    id TEXT PRIMARY KEY,
    note_id TEXT NOT NULL,
    shared_with_user_id TEXT NOT NULL,
    permission TEXT DEFAULT 'view',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES notes(id),
    FOREIGN KEY (shared_with_user_id) REFERENCES users(id)
);
