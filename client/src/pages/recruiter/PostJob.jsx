import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Briefcase, CheckCircle2, Plus, X } from 'lucide-react';

const DEPARTMENTS = ['CSE','IT','ECE','EEE','MECH','CIVIL','CSBS','AIDS'];
const ROUND_TYPES = ['aptitude', 'coding', 'technical', 'hr', 'group-discussion'];

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '', jobType: 'full-time',
    ctcMin: '', ctcMax: '', rolesCount: 1,
    minCGPA: 6.0, maxBacklogs: 0, departments: [], requiredSkills: '',
    deadline: '', hiringProcess: [{ round: 1, type: 'aptitude', name: 'Aptitude Test' }],
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleDept = (d) => {
    update('departments', form.departments.includes(d) ? form.departments.filter(x => x !== d) : [...form.departments, d]);
  };

  const addRound = () => {
    update('hiringProcess', [...form.hiringProcess, { round: form.hiringProcess.length + 1, type: 'technical', name: '' }]);
  };

  const removeRound = (i) => {
    update('hiringProcess', form.hiringProcess.filter((_, idx) => idx !== i).map((r, idx) => ({ ...r, round: idx + 1 })));
  };

  const updateRound = (i, field, val) => {
    const rounds = [...form.hiringProcess];
    rounds[i][field] = val;
    update('hiringProcess', rounds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/jobs', {
        title: form.title, description: form.description, location: form.location,
        jobType: form.jobType, ctcMin: Number(form.ctcMin), ctcMax: Number(form.ctcMax),
        rolesCount: Number(form.rolesCount),
        eligibilityCriteria: {
          minCGPA: Number(form.minCGPA), maxBacklogs: Number(form.maxBacklogs),
          departments: form.departments,
          requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
          batch: 2026,
        },
        deadline: form.deadline || undefined,
        hiringProcess: form.hiringProcess,
      });
      setSuccess(true);
      setTimeout(() => navigate('/recruiter/jobs'), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    }
    setLoading(false);
  };

  if (success) return (
    <DashboardLayout>
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success)' }}><CheckCircle2 size={32} /></div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Job Posted Successfully!</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Eligible students will be notified. Redirecting...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Post New Job</h1>
        <p className="page-subtitle">Create a new campus hiring position</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Job Details</div></div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" required value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Software Developer" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe the role and responsibilities" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input className="form-input" value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g. Chennai" />
                </div>
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select className="form-select" value={form.jobType} onChange={e => update('jobType', e.target.value)}>
                    <option value="full-time">Full Time</option><option value="internship">Internship</option><option value="contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">CTC Min (₹)</label><input type="number" className="form-input" value={form.ctcMin} onChange={e => update('ctcMin', e.target.value)} placeholder="e.g. 700000" /></div>
                <div className="form-group"><label className="form-label">CTC Max (₹)</label><input type="number" className="form-input" value={form.ctcMax} onChange={e => update('ctcMax', e.target.value)} placeholder="e.g. 1200000" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Positions</label><input type="number" className="form-input" value={form.rolesCount} onChange={e => update('rolesCount', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Deadline</label><input type="date" className="form-input" value={form.deadline} onChange={e => update('deadline', e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Eligibility Criteria</div></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Min CGPA</label><input type="number" step="0.1" className="form-input" value={form.minCGPA} onChange={e => update('minCGPA', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Max Backlogs</label><input type="number" className="form-input" value={form.maxBacklogs} onChange={e => update('maxBacklogs', e.target.value)} /></div>
              </div>

              <div className="form-group">
                <label className="form-label">Eligible Departments</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DEPARTMENTS.map(d => (
                    <button type="button" key={d} className={`filter-chip ${form.departments.includes(d) ? 'active' : ''}`} onClick={() => toggleDept(d)}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Required Skills</label>
                <input className="form-input" value={form.requiredSkills} onChange={e => update('requiredSkills', e.target.value)} placeholder="Comma-separated: Java, Python, SQL" />
              </div>

              <div className="form-group" style={{ marginTop: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Hiring Rounds</label>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addRound}><Plus size={14} /> Add Round</button>
                </div>
                {form.hiringProcess.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>{r.round}</span>
                    <select className="form-select" style={{ width: 150 }} value={r.type} onChange={e => updateRound(i, 'type', e.target.value)}>
                      {ROUND_TYPES.map(rt => <option key={rt} value={rt}>{rt.charAt(0).toUpperCase() + rt.slice(1)}</option>)}
                    </select>
                    <input className="form-input" placeholder="Round name" value={r.name} onChange={e => updateRound(i, 'name', e.target.value)} />
                    {form.hiringProcess.length > 1 && <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeRound(i)}><X size={14} /></button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            <Briefcase size={16} /> {loading ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
