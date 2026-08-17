import React, { useState, useEffect } from 'react';
import { Zap, X, Plus, Trash2, Edit3, Star, Search, Check, FileText } from 'lucide-react';

const DEFAULT_PANIC_ITEMS = [
  {
    id: 'panic-1',
    title: 'Quadratic Formula',
    subject: 'Mathematics',
    content: 'x = (-b ± √(b² - 4ac)) / 2a',
    isImportant: true
  },
  {
    id: 'panic-2',
    title: "Ohm's Law",
    subject: 'Physics',
    content: 'V = I × R\nVoltage (V) = Current (I) × Resistance (R)',
    isImportant: true
  }
];

export default function PanicModeModal({ isOpen, onClose }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('notenest_panic_mode');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PANIC_ITEMS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form inputs
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formContent, setFormContent] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('notenest_panic_mode', JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  if (!isOpen) return null;

  const handleToggleImportant = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isImportant: !item.isImportant } : item))
    );
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, title: formTitle, subject: formSubject || 'General', content: formContent }
            : item
        )
      );
      setEditingId(null);
    } else {
      const newItem = {
        id: 'panic-' + Date.now(),
        title: formTitle,
        subject: formSubject || 'General',
        content: formContent,
        isImportant: true
      };
      setItems((prev) => [newItem, ...prev]);
    }

    setFormTitle('');
    setFormSubject('');
    setFormContent('');
    setIsAdding(false);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormSubject(item.subject);
    setFormContent(item.content);
    setIsAdding(true);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(8, 12, 20, 0.95)',
        backdropFilter: 'blur(16px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        overflowY: 'auto'
      }}
    >
      {/* Panic Mode Top Bar */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto 1.5rem auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: '#eab308',
              color: '#080c14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Zap size={24} fill="currentColor" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              ⚡ Panic Mode
            </h1>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Instant high-priority formulas & key revision notes
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="btn"
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setFormTitle('');
              setFormSubject('');
              setFormContent('');
            }}
            style={{ background: '#eab308', color: '#080c14', padding: '0.65rem 1.25rem' }}
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              borderRadius: 10,
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <X size={18} />
            <span>Exit Panic Mode</span>
          </button>
        </div>
      </div>

      {/* Main Panic Content */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', flex: 1 }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              padding: '0.75rem 1rem'
            }}
          >
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search formulas or concepts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                width: '100%',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />
          </div>
        </div>

        {/* Form Overlay Modal */}
        {isAdding && (
          <form
            onSubmit={handleSaveItem}
            style={{
              background: '#121824',
              border: '1px solid #eab308',
              borderRadius: 16,
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 8px 32px rgba(234, 179, 8, 0.2)'
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              {editingId ? 'Edit Panic Item' : 'Add Panic Formula / Note'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Quadratic Formula"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="form-control"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Subject / Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                Content / Equation
              </label>
              <textarea
                placeholder="e.g. x = (-b ± √(b² - 4ac)) / 2a"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="form-control"
                rows={3}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn" style={{ background: '#eab308', color: '#080c14' }}>
                <Check size={18} />
                <span>Save to Panic Mode</span>
              </button>
            </div>
          </form>
        )}

        {/* Panic Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#121824',
                border: item.isImportant ? '1px solid rgba(234, 179, 8, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                position: 'relative',
                boxShadow: item.isImportant ? '0 4px 20px rgba(234, 179, 8, 0.1)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#fde047',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {item.subject}
                  </span>

                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleToggleImportant(item.id)}
                      style={{ background: 'transparent', border: 'none', color: item.isImportant ? '#eab308' : '#64748b', cursor: 'pointer' }}
                      title="Toggle Important"
                    >
                      <Star size={18} fill={item.isImportant ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      title="Edit Item"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      title="Delete Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
                  {item.title}
                </h3>

                <div
                  style={{
                    background: 'rgba(8, 12, 20, 0.8)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '1rem',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1rem',
                    color: '#4ade80',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {item.content}
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '3rem',
                textAlign: 'center',
                color: '#94a3b8',
                background: '#121824',
                borderRadius: 16,
                border: '1px dashed rgba(255,255,255,0.1)'
              }}
            >
              <FileText size={40} style={{ opacity: 0.4, marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1.05rem' }}>No Panic Mode items found</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Click "Add Item" above to save key formulas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
