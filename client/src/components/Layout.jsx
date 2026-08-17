import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import PanicModeModal from './PanicModeModal';
import AiAssistant from './AiAssistant';
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Search, 
  Bell, 
  HelpCircle,
  FileText,
  Sun,
  Moon,
  Zap
} from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { profile } = useUser();
  const [panicOpen, setPanicOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/library', label: 'My Library', icon: Folder },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="app-layout">
      {/* Persistent Left Sidebar */}
      <aside className="sidebar">
        <div>
          <NavLink to="/" className="sidebar-logo">
            <div className="logo-badge">
              <FileText size={20} />
            </div>
            <div>
              <span className="logo-title">NoteNest</span>
              <span className="logo-subtitle">Academic Workspace</span>
            </div>
          </NavLink>

          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button className="btn-create-note" onClick={() => navigate('/upload')}>
            <Plus size={18} />
            <span>+ Create Note</span>
          </button>

          <div className="sidebar-user" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
            <img
              src={profile.avatar}
              alt={profile.name}
              className="user-avatar-circle"
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {profile.major}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-search-box">
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search in your knowledge base..."
              className="top-search-input"
            />
          </div>

          <div className="top-bar-actions">
            {/* Panic Mode Action Button */}
            <button
              onClick={() => setPanicOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                color: '#080c14',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.45rem 0.85rem',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
                transition: 'all 0.2s ease'
              }}
              title="Instant Exam Panic Mode"
            >
              <Zap size={16} fill="currentColor" />
              <span>⚡ Panic Mode</span>
            </button>

            {/* Theme Mode Toggle Button */}
            <button
              className="top-bar-icon-btn"
              onClick={() => toggleTheme()}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            >
              {isDark ? <Sun size={18} color="#eab308" /> : <Moon size={18} color="#16a34a" />}
            </button>

            <button className="top-bar-icon-btn">
              <Bell size={18} />
            </button>
            <button className="top-bar-icon-btn">
              <HelpCircle size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/settings')}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{profile.name}</span>
              <img
                src={profile.avatar}
                alt={profile.name}
                className="user-avatar-circle"
                style={{ width: '30px', height: '30px' }}
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-container">
          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      <button className="fab-btn" title="Create New Note" onClick={() => navigate('/upload')}>
        <Plus size={24} />
      </button>

      {/* AI Assistant Floating Widget */}
      <AiAssistant />

      {/* Panic Mode Fullscreen Overlay */}
      <PanicModeModal isOpen={panicOpen} onClose={() => setPanicOpen(false)} />
    </div>
  );
}
