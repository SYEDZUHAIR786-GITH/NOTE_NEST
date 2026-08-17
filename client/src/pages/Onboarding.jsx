import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColleges, getDepartments, getSubjects } from '../api/colleges';
import { loginWithGoogle } from '../api/auth';
import { Building2, Layers, BookCheck, ArrowRight, CheckCircle2 } from 'lucide-react';


export default function Onboarding({ onComplete, user, setUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch colleges on load
  useEffect(() => {
    async function loadColleges() {
      try {
        setLoading(true);
        const res = await getColleges();
        setColleges(res.colleges || []);
      } catch (err) {
        setError('Failed to fetch colleges. Please make sure backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadColleges();
  }, []);

  // Fetch departments when college changes
  const handleSelectCollege = async (college) => {
    setSelectedCollege(college);
    setSelectedDept(null);
    setSelectedSubject(null);
    try {
      setLoading(true);
      const res = await getDepartments(college.id);
      setDepartments(res.departments || []);
      setStep(2);
    } catch (err) {
      setError('Failed to fetch departments.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects when department changes
  const handleSelectDept = async (dept) => {
    setSelectedDept(dept);
    setSelectedSubject(null);
    try {
      setLoading(true);
      const res = await getSubjects(dept.id);
      setSubjects(res.subjects || []);
      setStep(3);
    } catch (err) {
      setError('Failed to fetch subjects.');
    } finally {
      setLoading(false);
    }
  };

  // Finalize onboarding
  const handleFinish = async () => {
    if (!selectedCollege || !selectedDept || !selectedSubject) return;

    try {
      setLoading(true);
      const authRes = await loginWithGoogle({
        email: user?.email || 'student@notenest.edu',
        name: user?.name || 'Alex Rivera',
        collegeId: selectedCollege.id,
        deptId: selectedDept.id
      });

      if (typeof setUser === 'function') {
        setUser({
          ...authRes.user,
          collegeName: selectedCollege.name,
          collegeCode: selectedCollege.code,
          deptName: selectedDept.name,
          activeSubject: selectedSubject
        });
      }

      if (typeof onComplete === 'function') onComplete(selectedSubject);
      else navigate('/dashboard');
    } catch (err) {
      setError('Failed to finalize onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stepper-container">
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1 className="page-title">Welcome to NoteNest</h1>
        <p className="page-subtitle">Configure your academic scope in 3 quick steps</p>
      </div>

      {/* Step Indicators */}
      <div className="steps-progress">
        <div className={`step-item ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">
            {step > 1 ? <CheckCircle2 size={20} /> : <Building2 size={20} />}
          </div>
          <span className="step-label">1. College</span>
        </div>

        <div className={`step-item ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">
            {step > 2 ? <CheckCircle2 size={20} /> : <Layers size={20} />}
          </div>
          <span className="step-label">2. Department</span>
        </div>

        <div className={`step-item ${step === 3 ? 'active' : ''}`}>
          <div className="step-number">
            <BookCheck size={20} />
          </div>
          <span className="step-label">3. Subject</span>
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: '8px', color: '#fca5a5', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Step 1: Select College */}
      {step === 1 && (
        <div className="glass-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Select Your College</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pick your institution to load corresponding department catalogs</p>

          {loading ? (
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Loading colleges...</p>
          ) : (
            <div className="options-grid">
              {colleges.map((col) => (
                <div
                  key={col.id}
                  className={`option-card ${selectedCollege?.id === col.id ? 'selected' : ''}`}
                  onClick={() => handleSelectCollege(col)}
                >
                  <div className="option-title">{col.name}</div>
                  <span className="option-code">{col.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Department */}
      {step === 2 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Select Your Department</h2>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setStep(1)}>
              Change College
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Current College: <strong style={{ color: 'var(--primary-hover)' }}>{selectedCollege?.name}</strong>
          </p>

          {loading ? (
            <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Loading departments...</p>
          ) : (
            <div className="options-grid">
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`option-card ${selectedDept?.id === dept.id ? 'selected' : ''}`}
                  onClick={() => handleSelectDept(dept)}
                >
                  <div className="option-title">{dept.name}</div>
                  <span className="option-code">{dept.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Select Subject */}
      {step === 3 && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Select Target Subject</h2>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setStep(2)}>
              Change Department
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {selectedCollege?.name} → {selectedDept?.name}
          </p>

          {loading ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading subjects...</p>
          ) : (
            <div className="options-grid">
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  className={`option-card ${selectedSubject?.id === sub.id ? 'selected' : ''}`}
                  onClick={() => setSelectedSubject(sub)}
                >
                  <div>
                    <div className="option-title">{sub.name}</div>
                    <span className="option-code">{sub.subject_code}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn"
              disabled={!selectedSubject || loading}
              onClick={handleFinish}
            >
              <span>Enter Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
