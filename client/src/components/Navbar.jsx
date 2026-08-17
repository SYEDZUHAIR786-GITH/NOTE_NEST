import React from 'react';
import { BookOpen, Upload, Compass, GraduationCap, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, user }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="brand" onClick={() => setActivePage('dashboard')}>
          <div className="brand-icon">
            <GraduationCap size={22} />
          </div>
          <span>NoteNest</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-btn ${activePage === 'onboarding' ? 'active' : ''}`}
            onClick={() => setActivePage('onboarding')}
          >
            <Compass size={16} />
            <span>Onboarding</span>
          </button>

          <button
            className={`nav-btn ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <BookOpen size={16} />
            <span>Dashboard</span>
          </button>

          <button
            className={`nav-btn ${activePage === 'upload' ? 'active' : ''}`}
            onClick={() => setActivePage('upload')}
          >
            <Upload size={16} />
            <span>Upload Note</span>
          </button>
        </div>

        <div className="user-badge">
          <div className="avatar">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Alex Rivera'}</span>
            <span className="user-college">{user?.collegeCode || 'MIT CS'}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
