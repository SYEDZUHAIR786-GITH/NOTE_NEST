import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useUser } from '../context/UserContext';
import { getSubjects } from '../api/colleges';
import { getNotesBySubject, getAllNotes } from '../api/notes';
import FocusTimer from '../components/FocusTimer';
import {
  FileText, Clock, Star, Share2, MoreVertical,
  MessageSquare, CheckCircle, UserPlus, Play,
  Loader2, AlertCircle, BookOpen, Plus
} from 'lucide-react';

// ─── Skeleton placeholder ───────────────────────────────────
function Skeleton({ h = 18, w = '100%', r = 8 }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: r,
      background: 'rgba(255,255,255,0.06)',
      animation: 'pulse 1.5s ease-in-out infinite'
    }} />
  );
}

const DEPT_ID = 'dept-mit-cs';   // default dept; swap once auth is wired

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const [activeSubjectId, setActiveSubjectId] = useState(null);

  // ── real data ────────────────────────────────────────────
  const subjects = useApi(() => getSubjects(DEPT_ID), [DEPT_ID]);
  const allNotes = useApi(() => getAllNotes(), []);

  // pick first subject as default when loaded
  const subjectList = subjects.data?.subjects ?? [];
  const currentSubId = activeSubjectId ?? subjectList[0]?.id ?? null;

  const notes = useApi(
    () => currentSubId ? getNotesBySubject(currentSubId) : Promise.resolve({ notes: [] }),
    [currentSubId]
  );
  const noteList = notes.data?.notes ?? [];

  // ── derived stats ─────────────────────────────────────────
  const totalNotes = allNotes.loading ? '…' : (allNotes.data?.count ?? 0);

  return (
    <div>
      {/* ── Welcome header ───────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
          Welcome back, {profile.name.split(' ')[0]}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your academic workspace is ready. {totalNotes === 0 ? 'Upload your first study note to get started!' : `You have ${totalNotes} saved notes in your library.`}
        </p>
      </div>

      {/* ── Stat Cards ───────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { title: 'Total Notes',     value: notes.loading ? '…' : totalNotes,      icon: FileText,  color: '#3b82f6' },
          { title: 'Focus Time',      value: '14h',                                 icon: Clock,     color: '#22c55e' },
          { title: 'Favourites',      value: '24',                                  icon: Star,      color: '#eab308' },
          { title: 'Shared Folders',  value: subjects.loading ? '…' : subjectList.length, icon: Share2, color: '#a855f7' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <Icon size={22} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, marginTop: 2 }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Subject Folders */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Subject Folders</h2>
              <button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} onClick={() => navigate('/library')}>View All →</button>
            </div>

            {subjects.error && (
              <div style={{ display: 'flex', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 10, marginBottom: '1rem' }}>
                <AlertCircle size={16} /> Backend unreachable — start the server then refresh.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1.25rem' }}>
              {subjects.loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="card" style={{ minHeight: 120, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <Skeleton h={16} w="60%" /><Skeleton h={12} w="80%" /><Skeleton h={22} w="40%" r={6} />
                    </div>
                  ))
                : subjectList.map((sub, idx) => {
                    const colors = ['#3b82f6','#f97316','#22c55e','#a855f7'];
                    const badgeClasses = ['badge-blue','badge-orange','badge-green','badge-purple'];
                    const isActive = sub.id === currentSubId;
                    return (
                      <div
                        key={sub.id}
                        className="card card-hover"
                        style={{ cursor: 'pointer', minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderColor: isActive ? 'rgba(34,197,94,0.5)' : undefined, background: isActive ? 'rgba(34,197,94,0.05)' : undefined }}
                        onClick={() => setActiveSubjectId(sub.id)}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors[idx % colors.length] }}>
                              <BookOpen size={18} />
                            </div>
                            <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                              <MoreVertical size={15} />
                            </button>
                          </div>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{sub.name}</h3>
                          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            {notes.loading && isActive ? 'Loading…' : isActive ? `${noteList.length} Notes` : '—'}
                          </p>
                        </div>
                        <span className={`badge ${badgeClasses[idx % badgeClasses.length]}`} style={{ width: 'fit-content', marginTop: '0.75rem' }}>
                          {sub.subject_code}
                        </span>
                      </div>
                    );
                  })
              }
            </div>
          </section>

          {/* Recent Notes */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Notes</h2>
              <button className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }} onClick={() => navigate('/library')}>View All →</button>
            </div>

            {notes.loading && <div className="card" style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}><Loader2 size={24} className="spin" style={{ marginBottom: 8 }} /><p>Loading notes…</p></div>}

            {!notes.loading && noteList.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                <FileText size={36} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
                <p style={{ fontWeight: 600 }}>No notes yet for this subject.</p>
                <button className="btn-primary" style={{ marginTop: '1.25rem', fontSize: '0.85rem' }} onClick={() => navigate('/upload')}>
                  <Plus size={16} /> Upload First Note
                </button>
              </div>
            )}

            {noteList.slice(0, 3).map((note) => (
              <div key={note.id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{note.original_name || note.filename}</div>
                    {note.summary && <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>{note.summary}</p>}
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.4rem' }}>
                      {new Date(note.upload_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <span className="note-badge" style={{ flexShrink: 0 }}>{note.classification_method || 'manual'}</span>
              </div>
            ))}
          </section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Activity Feed */}
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem' }}>Activity Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(allNotes.data?.notes || []).length > 0 ? (
                (allNotes.data?.notes || []).slice(0, 4).map((n) => (
                  <div key={n.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', flexShrink: 0 }}>
                      <FileText size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Uploaded note to {n.subject_code || 'Subject'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {n.original_name || n.filename}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(n.upload_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No recent activity yet. Upload a note to see activity log.
                </div>
              )}
            </div>
          </div>

          {/* Focus Timer Component */}
          <FocusTimer />
        </div>
      </div>

      {/* Keyframe for skeleton pulse & spinner */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
