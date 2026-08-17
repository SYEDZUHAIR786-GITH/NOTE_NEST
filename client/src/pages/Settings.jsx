import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { User, Sun, Moon, Bell, Shield, Key, Check, Camera, RefreshCw } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { profile, updateProfile, updateAvatar, resetAvatar, defaultAvatar } = useUser();

  const fileInputRef = useRef(null);

  const [name, setName] = useState(profile?.name || 'Alex Rivera');
  const [email, setEmail] = useState(profile?.email || 'alex.rivera@university.edu');
  const [major, setMajor] = useState(profile?.major || 'Computer Science & AI');

  useEffect(() => {
    if (profile) {
      setName(profile.name || 'Alex Rivera');
      setEmail(profile.email || 'alex.rivera@university.edu');
      setMajor(profile.major || 'Computer Science & AI');
    }
  }, [profile]);

  const [emailDigest, setEmailDigest] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/i)) {
      alert('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updateAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, email, major });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '900px' }}>
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        style={{ display: 'none' }}
      />

      {/* Settings Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Manage your account preferences and academic workspace environment.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Profile Card */}
        <form onSubmit={handleSaveProfile} className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-green)', fontWeight: 700, fontSize: '1.05rem' }}>
              <User size={20} />
              <span>Profile Information</span>
            </div>
            {saved && (
              <span style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Check size={16} /> Saved!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar Edit Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile picture"
              >
                <img
                  src={profile?.avatar || defaultAvatar}
                  alt={profile?.name || 'User Profile'}
                  style={{ width: 92, height: 92, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-green)' }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--primary-green)',
                    border: '2px solid var(--bg-card)',
                    color: '#080c14',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Upload image"
                >
                  <Camera size={15} />
                </button>
              </div>

              {profile?.avatar && profile.avatar !== defaultAvatar && (
                <button
                  type="button"
                  onClick={resetAvatar}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <RefreshCw size={12} /> Reset Avatar
                </button>
              )}
            </div>

            {/* Fields Grid */}
            <div style={{ flex: 1, minWidth: '280px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                  MAJOR / AREA OF STUDY
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  required
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn" style={{ fontSize: '0.88rem', padding: '0.65rem 1.25rem' }}>
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* 2-Column Row: Appearance & Notifications */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Appearance */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-green)', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              <Moon size={18} />
              <span>Appearance</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 12,
                  background: isDark ? 'var(--primary-green-light)' : 'var(--search-bg)',
                  border: isDark ? '1px solid var(--border-accent)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => toggleTheme('dark')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Moon size={18} color={isDark ? 'var(--primary-green)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 600, color: isDark ? 'var(--primary-green)' : 'var(--text-primary)', fontSize: '0.9rem' }}>Dark Mode</span>
                </div>
                <div style={{ width: 40, height: 22, borderRadius: 11, background: isDark ? 'var(--primary-green)' : '#94a3b8', position: 'relative', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-dark)', position: 'absolute', top: 2, left: isDark ? 20 : 2, transition: 'all 0.2s ease' }} />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: 12,
                  background: !isDark ? 'var(--primary-green-light)' : 'var(--search-bg)',
                  border: !isDark ? '1px solid var(--border-accent)' : '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onClick={() => toggleTheme('light')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Sun size={18} color={!isDark ? 'var(--primary-green)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 600, color: !isDark ? 'var(--primary-green)' : 'var(--text-primary)', fontSize: '0.9rem' }}>Light Mode</span>
                </div>
                <div style={{ width: 40, height: 22, borderRadius: 11, background: !isDark ? 'var(--primary-green)' : '#94a3b8', position: 'relative', transition: 'all 0.2s ease' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--bg-dark)', position: 'absolute', top: 2, left: !isDark ? 20 : 2, transition: 'all 0.2s ease' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#22c55e', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              <Bell size={18} />
              <span>Notifications</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Email Summary</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Weekly digest of your notes</div>
                </div>
                <div
                  style={{ width: 40, height: 22, borderRadius: 11, background: emailDigest ? '#22c55e' : '#334155', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setEmailDigest(!emailDigest)}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#080c14', position: 'absolute', top: 2, left: emailDigest ? 20 : 2, transition: 'all 0.2s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Push Notifications</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Real-time collaboration alerts</div>
                </div>
                <div
                  style={{ width: 40, height: 22, borderRadius: 11, background: pushNotifs ? '#22c55e' : '#334155', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setPushNotifs(!pushNotifs)}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#080c14', position: 'absolute', top: 2, left: pushNotifs ? 20 : 2, transition: 'all 0.2s ease' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Study Reminders</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Daily nudge for spaced repetition</div>
                </div>
                <div
                  style={{ width: 40, height: 22, borderRadius: 11, background: studyReminders ? '#22c55e' : '#334155', position: 'relative', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onClick={() => setStudyReminders(!studyReminders)}
                >
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#080c14', position: 'absolute', top: 2, left: studyReminders ? 20 : 2, transition: 'all 0.2s ease' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security Section + Footer Buttons */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#22c55e', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
            <Shield size={18} />
            <span>Privacy & Security</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                PASSWORD
              </label>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={16} /> Update Password
                </span>
                <span>›</span>
              </button>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                DATA SHARING
              </label>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                Share Anonymous Usage Analytics to help us improve NoteNest.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button className="btn-secondary">Discard</button>
            <button className="btn-primary" onClick={handleSave}>
              {saved ? <Check size={18} /> : null}
              <span>{saved ? 'Saved!' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
