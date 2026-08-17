import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Eye } from 'lucide-react';

export default function CreateAccount() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: '#080c14',
      backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
      backgroundSize: '24px 24px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 44,
            height: 44,
            background: '#22c55e',
            borderRadius: 10,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080c14',
            marginBottom: '0.75rem'
          }}>
            <FileText size={24} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>NoteNest</h1>
        </div>

        {/* Signup Card */}
        <div className="card" style={{ padding: '2.5rem 2rem', background: '#121824', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16 }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.35rem' }}>
            Join the community
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', marginBottom: '1.75rem' }}>
            Start your organized academic journey today.
          </p>

          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Rivera"
                className="form-input"
                required
              />
            </div>

            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                University Email
              </label>
              <input
                type="email"
                placeholder="alex.rivera@university.edu"
                className="form-input"
                required
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input"
                  required
                />
                <Eye size={16} color="#64748b" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
              Create Account
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: '#64748b', fontSize: '0.75rem' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <button
            type="button"
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
            onClick={() => navigate('/dashboard')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#22c55e', textDecoration: 'none', fontWeight: 700 }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
