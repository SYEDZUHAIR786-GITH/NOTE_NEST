import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { getSubjects } from '../api/colleges';
import { getNotesBySubject } from '../api/notes';
import { FileText, FolderPlus, MoreVertical, ChevronDown, Loader2, AlertCircle, Plus } from 'lucide-react';

const DEPT_ID = 'dept-mit-cs';

const FILE_TYPE_MAP = {
  '.pdf': { label: 'PDF',     cls: 'badge-blue'   },
  '.note':{ label: 'Note',    cls: 'badge-green'  },
  '.formula':{ label: 'Formula', cls: 'badge-purple' },
  '.docx':{ label: 'Doc',     cls: 'badge-orange' },
};

function getFileType(filename) {
  const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
  return FILE_TYPE_MAP[ext] ?? { label: 'File', cls: 'badge-blue' };
}

function formatBytes(n) {
  if (!n) return '—';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function Skeleton({ h = 16, w = '100%', r = 8 }) {
  return <div style={{ height: h, width: w, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

export default function Library() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter]     = useState('All');
  const [activeFolderId, setActiveFolderId] = useState(null);

  const subjects = useApi(() => getSubjects(DEPT_ID), [DEPT_ID]);
  const subjectList = subjects.data?.subjects ?? [];

  const folderId = activeFolderId ?? subjectList[0]?.id ?? null;

  const notes = useApi(
    () => folderId ? getNotesBySubject(folderId) : Promise.resolve({ notes: [] }),
    [folderId]
  );
  const noteList = notes.data?.notes ?? [];

  // Filter by pill selection
  const filtered = noteList.filter((n) => {
    if (activeFilter === 'All') return true;
    const { label } = getFileType(n.filename);
    return label.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div>
      {/* Filter row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="filter-pills">
          {['All', 'PDF', 'Notes', 'Formulas'].map((f) => (
            <button key={f} className={`pill-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}>
          <span>Sort by: <strong style={{ color: '#fff' }}>Date Modified</strong></span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* Subject Folders */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#94a3b8' }}>Subject Folders</h2>

        {subjects.error && (
          <div style={{ display: 'flex', gap: '0.5rem', color: '#fca5a5', fontSize: '0.85rem', padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 10, marginBottom: '1rem' }}>
            <AlertCircle size={16} /> Could not load subjects — is the server running on port 3001?
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1.25rem' }}>
          {subjects.loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card" style={{ minHeight: 110, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Skeleton h={16} w="60%" /><Skeleton h={12} w="80%" />
                </div>
              ))
            : subjectList.map((sub, idx) => {
                const colors = ['#3b82f6','#f97316','#22c55e','#a855f7'];
                const isActive = sub.id === folderId;
                return (
                  <div
                    key={sub.id}
                    className="card card-hover"
                    style={{ cursor: 'pointer', borderColor: isActive ? 'rgba(34,197,94,0.6)' : undefined, background: isActive ? 'rgba(34,197,94,0.06)' : undefined }}
                    onClick={() => setActiveFolderId(sub.id)}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors[idx % colors.length], marginBottom: '1rem' }}>
                      <FileText size={20} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{sub.name}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{sub.subject_code}</p>
                  </div>
                );
              })
          }

          {/* New Subject card */}
          {!subjects.loading && (
            <div
              style={{ border: '2px dashed rgba(255,255,255,0.12)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 130, color: '#64748b', transition: 'all 0.2s ease' }}
              onClick={() => navigate('/onboarding')}
            >
              <FolderPlus size={24} style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#94a3b8' }}>New Subject</span>
            </div>
          )}
        </div>
      </div>

      {/* Files table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Files
            {folderId && !notes.loading && <span style={{ marginLeft: '0.6rem', fontWeight: 400, color: '#64748b', fontSize: '0.85rem' }}>({filtered.length})</span>}
          </h2>
          <button className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }} onClick={() => navigate('/upload')}>
            <Plus size={15} /> Upload
          </button>
        </div>

        {notes.loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
            <p>Loading files…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>No files in this folder yet</p>
            <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>Upload your first note or document to start organizing.</p>
            <button className="btn-primary" style={{ fontSize: '0.85rem', margin: '0 auto' }} onClick={() => navigate('/upload')}>
              <Plus size={16} /> Upload First File
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Modified</th>
                  <th>Type</th>
                  <th>Classification</th>
                  <th style={{ textAlign: 'right' }}>·</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((note) => {
                  const { label, cls } = getFileType(note.filename);
                  return (
                    <tr key={note.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FileText size={17} color="#22c55e" />
                          <span style={{ fontWeight: 600, color: '#fff' }}>{note.original_name || note.filename}</span>
                        </div>
                      </td>
                      <td>{new Date(note.upload_date).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{note.classification_method}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
