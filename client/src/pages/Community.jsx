import React from 'react';
import { Users, BookOpen, Star, Download, Plus, ArrowRight, Code2, Binary, Sparkles } from 'lucide-react';

export default function Community() {
  const subjectTags = ['Computer Science', 'Mathematics', 'Engineering', 'Physics'];

  const studyGroups = [
    {
      title: 'CS 301: Data Structures',
      desc: 'Mastering trees, graphs, and algorithm efficiency for midterms.',
      active: 'Active 2h ago',
      icon: Code2,
      code: 'CS 301'
    },
    {
      title: 'Math 110: Discrete Math',
      desc: 'Weekly proof-writing sessions and logic theory discussions.',
      active: 'Active now',
      icon: Binary,
      code: 'MATH 110'
    }
  ];

  const contributors = [
    { rank: 1, name: 'Sarah J.', notes: '1.2k shared notes', pts: '+450 pts', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
    { rank: 2, name: 'Marcus T.', notes: '940 shared notes', pts: '+380 pts', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
    { rank: 3, name: 'Elena R.', notes: '820 shared notes', pts: '+310 pts', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80' }
  ];

  const topRatedNotes = [
    {
      title: 'Quantum Tunneling Simplified',
      summary: 'Complete breakdown of particle wave duality and potential barriers with visual diagrams.',
      tags: ['PHYSICS 101', 'MECHANICS'],
      rating: '4.9',
      reviews: '1.2k',
      downloads: '2.4k',
      badgeClass: 'badge-blue'
    },
    {
      title: 'CRISPR Technology Guide',
      summary: 'Comprehensive notes on gene editing mechanisms and ethical considerations for bio majors.',
      tags: ['BIOLOGY', 'GENETICS'],
      rating: '4.8',
      reviews: '912',
      downloads: '1.9k',
      badgeClass: 'badge-orange'
    },
    {
      title: 'Supreme Court Case Studies',
      summary: 'A decade of landmark rulings summarized with dissenting opinions and legal impact.',
      tags: ['LAW', 'CONSTITUTIONAL'],
      rating: '5.0',
      reviews: '2.1k',
      downloads: '3.5k',
      badgeClass: 'badge-green'
    }
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #121824 0%, #1e293b 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '2.5rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Welcome to the <span style={{ color: '#22c55e' }}>Community</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
          Join 50,000+ students sharing knowledge, building study groups, and mastering complex subjects together.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {subjectTags.map((tag, idx) => (
            <button key={idx} className="pill-btn" style={{ background: 'rgba(255, 255, 255, 0.06)' }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginBottom: '3rem' }}>
        {/* Study Groups */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Study Groups</h2>
            <a href="#viewall" style={{ fontSize: '0.85rem', color: '#22c55e', textDecoration: 'none', fontWeight: 600 }}>View all →</a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {studyGroups.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{group.active}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>{group.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{group.desc}</p>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-blue">{group.code}</span>
                    <button className="btn-blue">Join Group</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Contributors Leaderboard */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Contributors</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contributors.map((user) => (
              <div key={user.rank} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={user.avatar} alt={user.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user.notes}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#22c55e', background: 'rgba(34, 197, 94, 0.15)', padding: '2px 8px', borderRadius: 6 }}>
                  {user.pts}
                </span>
              </div>
            ))}
          </div>

          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem', padding: '0.65rem', fontSize: '0.85rem' }}>
            See Full Rankings
          </button>
        </div>
      </div>

      {/* Top-Rated Notes Section */}
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>Top-Rated Notes</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>The community's most saved and highly rated resources.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {topRatedNotes.map((note, idx) => (
            <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  {note.tags.map((t, i) => (
                    <span key={i} className={`badge ${note.badgeClass}`}>{t}</span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{note.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>{note.summary}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#eab308', fontWeight: 700 }}>
                    <Star size={14} fill="currentColor" /> {note.rating} ({note.reviews})
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Download size={14} /> {note.downloads}
                  </span>
                </div>

                <button style={{ width: 34, height: 34, borderRadius: '50%', background: '#22c55e', border: 'none', color: '#080c14', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
