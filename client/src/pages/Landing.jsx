import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Play, Cpu, Zap, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div style={{ background: '#080c14', minHeight: '100vh', color: '#fff' }}>
      {/* Top Header Navigation */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 4rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'sticky',
        top: 0,
        background: 'rgba(8, 12, 20, 0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 34, height: 34, background: '#22c55e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#080c14' }}>
            <FileText size={20} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>NoteNest</span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>
          <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
          <a href="#community" style={{ color: 'inherit', textDecoration: 'none' }}>Community</a>
          <a href="#pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '5rem 2rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          Organize Your Academic<br />
          World with <span style={{ color: '#22c55e' }}>NoteNest</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '650px', margin: '0 auto 2.5rem' }}>
          The all-in-one workspace for students to capture notes, organize subjects, and collaborate with the community.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
          <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            Get Started for Free
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            <Play size={16} fill="currentColor" />
            <span>Watch Demo</span>
          </Link>
        </div>

        {/* Mockup Dashboard Container */}
        <div style={{
          background: '#121824',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 20,
          padding: '1.5rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#eab308' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          </div>
          <div style={{ height: '340px', background: '#0a0e17', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <div style={{ textAlign: 'center' }}>
              <FileText size={48} color="#22c55e" style={{ opacity: 0.8, marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>NoteNest Dashboard Preview</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Interactive preview loading active study folders & AI classification</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos Row */}
      <section style={{ textAlign: 'center', padding: '3rem 2rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1.5rem' }}>
          TRUSTED BY STUDENTS FROM OVER 500+ COLLEGES
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', color: '#64748b', fontWeight: 700, fontSize: '1.1rem' }}>
          <span>Ivy League</span>
          <span>Stanford</span>
          <span>TechInst</span>
          <span>Oxford</span>
        </div>
      </section>

      {/* 3-Feature Grid */}
      <section id="features" style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Everything you need to excel</h2>
        <p style={{ color: '#94a3b8', marginBottom: '3.5rem' }}>Focused tools designed for the modern academic journey.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 42, height: 42, background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>AI-Powered Detection</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Smartly categorize and analyze your notes. Our AI understands content, linking related subjects automatically.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 42, height: 42, background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Zap size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Panic Mode</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Stay focused during high-stakes revision sessions. One click to hide distractions and focus on critical concepts.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ width: 42, height: 42, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Student Community</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Share and discover resources from peers. Access a global library of study guides and lecture summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section style={{ maxWidth: '1100px', margin: '0 auto 6rem', padding: '0 2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          borderRadius: 24,
          padding: '4rem 2rem',
          textAlign: 'center',
          color: '#080c14'
        }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: '#080c14' }}>
            Ready to transform your study habits?
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: '2rem', fontWeight: 600 }}>
            Join thousands of students who have already organized their academic life with NoteNest.
          </p>
          <Link to="/register" style={{
            background: '#080c14',
            color: '#fff',
            fontWeight: 700,
            padding: '0.9rem 2.25rem',
            borderRadius: 12,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
