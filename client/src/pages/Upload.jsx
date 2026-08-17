import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadNote, classifyNote } from '../api/notes';
import { getSubjects } from '../api/colleges';
import { Upload, FileUp, CheckCircle, Cpu, AlertCircle, ArrowRight, FileText, Sparkles } from 'lucide-react';

export default function UploadPage({ activeSubject, onUploadSuccess, user }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(activeSubject?.id || 'sub-mit-cs201');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');

  const [classificationResult, setClassificationResult] = useState(null);
  const [classifying, setClassifying] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const deptId = user?.deptId || 'dept-mit-cs';

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await getSubjects(deptId);
        setSubjects(res.subjects || []);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      }
    }
    loadSubjects();
  }, [deptId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setClassificationResult(null);
      setErrorMessage(null);
    }
  };

  // Run 5-Layer Stub Classifier
  const handleRunClassifier = async () => {
    if (!file) {
      setErrorMessage('Please select a file first.');
      return;
    }

    try {
      setClassifying(true);
      setErrorMessage(null);

      const targetSub = subjects.find((s) => s.id === selectedSubjectId);

      const result = await classifyNote({
        filename: file.name,
        subjectHint: targetSub?.subject_code || 'CS201'
      });

      setClassificationResult(result);
      if (result.suggestedTags) {
        setTags(result.suggestedTags.join(', '));
      }
      if (result.predictedSubjectId && !selectedSubjectId) {
        setSelectedSubjectId(result.predictedSubjectId);
      }
    } catch (err) {
      setErrorMessage('Failed to trigger classification pipeline stub.');
    } finally {
      setClassifying(false);
    }
  };

  // Submit Upload Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user?.id || 'usr-demo');
      formData.append('subjectId', selectedSubjectId);
      formData.append('summary', summary || `Uploaded study note: ${file.name}`);
      formData.append('tags', tags || 'notes,study');
      formData.append(
        'classificationMethod',
        classificationResult?.classificationMethod || 'manual-tag'
      );

      const res = await uploadNote(formData);
      setStatusMessage('Note uploaded successfully!');

      setTimeout(() => {
        if (typeof onUploadSuccess === 'function') onUploadSuccess(selectedSubjectId);
        else navigate('/library');
      }, 1000);
    } catch (err) {
      setErrorMessage('Upload failed. Please ensure server is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Upload & Classify Note</h1>
        <p className="page-subtitle">
          Upload PDF/Document notes to auto-index into your subject repository
        </p>
      </div>

      {statusMessage && (
        <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: '12px', color: '#6ee7b7', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '12px', color: '#fca5a5', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card">
        {/* File Drop / Selector */}
        <div className="form-group">
          <label className="form-label">Note Document (PDF / TXT / DOCX)</label>
          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: file ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.txt,.docx,.png,.jpg"
            />
            {file ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={40} color="#818cf8" />
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{file.name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for classification
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <FileUp size={40} color="#94a3b8" />
                <span style={{ fontWeight: 600, fontSize: '1rem' }}>Click or drag file to select</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>Supports PDF, TXT, images up to 100MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Classification Stub Trigger Button */}
        {file && (
          <div style={{ margin: '1.25rem 0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--border-accent)' }}
              onClick={handleRunClassifier}
              disabled={classifying}
            >
              <Sparkles size={18} color="#ec4899" />
              <span>{classifying ? 'Running 5-Layer Stub Engine...' : 'Test 5-Layer AI Classification Stub'}</span>
            </button>
          </div>
        )}

        {/* Classification Result Drawer */}
        {classificationResult && (
          <div className="pipeline-drawer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="#06b6d4" />
                <strong style={{ fontSize: '0.95rem' }}>5-Layer Pipeline Result (Stub)</strong>
              </div>
              <span className="note-badge">
                Confidence: {(classificationResult.confidenceScore * 100).toFixed(0)}%
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              {classificationResult.layersProcessed.map((l) => (
                <div key={l.layer} className="pipeline-layer">
                  <div>
                    <span className="layer-tag">L{l.layer}</span> - {l.name}
                  </div>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>Passed ({(l.score * 100).toFixed(0)}%)</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Detected Keywords: {classificationResult.detectedKeywords.join(', ')}
            </div>
          </div>
        )}

        {/* Subject Target Selector */}
        <div className="form-group" style={{ marginTop: '1.5rem' }}>
          <label className="form-label">Target Subject</label>
          <select
            className="form-control"
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
          >
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subject_code} - {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="form-group">
          <label className="form-label">Summary / Description</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="Brief description of note contents (e.g. Midterm revision guide for graph algorithms)"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="form-group">
          <label className="form-label">Comma-Separated Tags</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. algorithms, trees, exam-prep"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn" disabled={!file || uploading}>
            <span>{uploading ? 'Uploading...' : 'Save Note to Repository'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
