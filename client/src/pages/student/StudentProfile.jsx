import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Save, Plus, X, Upload, CheckCircle2 } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    api.get('/profile').then(r => { setProfile(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = (field, value) => setProfile(p => ({ ...p, [field]: value }));

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      update('skills', [...(profile.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (s) => update('skills', profile.skills.filter(sk => sk !== s));

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile', profile);
      setProfile(res.data);
      setMsg('Profile saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Error saving profile');
    }
    setSaving(false);
  };

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  const completion = (() => {
    const f = [profile?.department, profile?.cgpa > 0, profile?.phone, profile?.skills?.length > 0, profile?.resume, profile?.projects?.length > 0, profile?.tenthPercentage > 0, profile?.twelfthPercentage > 0];
    return Math.round((f.filter(Boolean).length / f.length) * 100);
  })();

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your academic and placement profile</p>
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', background: 'var(--success-bg)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckCircle2 size={16} /> {msg}
        </div>
      )}

      {/* Profile completion bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="text-sm font-semibold">Profile Completion</span>
              <span className="text-sm font-bold" style={{ color: completion > 70 ? 'var(--success)' : 'var(--warning)' }}>{completion}%</span>
            </div>
            <div className="progress-bar-track">
              <div className={`progress-bar-fill ${completion > 70 ? 'success' : 'warning'}`} style={{ width: `${completion}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Personal Info */}
        <div className="card">
          <div className="card-header"><div className="card-title">Personal Information</div></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={user?.name || ''} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.7 }} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={profile?.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={profile?.gender || ''} onChange={e => update('gender', e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input className="form-input" value={profile?.city || ''} onChange={e => update('city', e.target.value)} placeholder="Your city" />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="card">
          <div className="card-header"><div className="card-title">Academic Details</div></div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={profile?.department || ''} onChange={e => update('department', e.target.value)}>
                  <option value="">Select Department</option>
                  {['CSE','IT','ECE','EEE','MECH','CIVIL','CSBS','AIDS'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <select className="form-select" value={profile?.graduationYear || ''} onChange={e => update('graduationYear', parseInt(e.target.value))}>
                  <option value="">Select</option>
                  {[2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">CGPA</label>
                <input type="number" step="0.01" min="0" max="10" className="form-input" value={profile?.cgpa || ''} onChange={e => update('cgpa', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">Active Backlogs</label>
                <input type="number" min="0" className="form-input" value={profile?.backlogs ?? ''} onChange={e => update('backlogs', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">10th %</label>
                <input type="number" step="0.1" className="form-input" value={profile?.tenthPercentage || ''} onChange={e => update('tenthPercentage', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="form-group">
                <label className="form-label">12th %</label>
                <input type="number" step="0.1" className="form-input" value={profile?.twelfthPercentage || ''} onChange={e => update('twelfthPercentage', parseFloat(e.target.value) || 0)} />
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="card-header"><div className="card-title">Skills</div></div>
          <div className="card-body">
            <div className="tags-list" style={{ marginBottom: 12 }}>
              {(profile?.skills || []).map((s, i) => (
                <span className="tag tag-primary" key={i}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex' }}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="form-input" placeholder="Add a skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
              <button className="btn btn-secondary" onClick={addSkill}><Plus size={16} /></button>
            </div>
          </div>
        </div>

        {/* Resume */}
        <div className="card">
          <div className="card-header"><div className="card-title">Resume / Documents</div></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Resume Link (Google Drive / URL)</label>
              <input className="form-input" value={profile?.resume || ''} onChange={e => update('resume', e.target.value)} placeholder="Paste your resume link" />
              <div className="form-hint">Upload to Google Drive and share the link</div>
            </div>
            {profile?.resume && (
              <div style={{ padding: '12px 16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem', color: 'var(--success)' }}>
                <CheckCircle2 size={16} /> Resume uploaded
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header"><div className="card-title">Placement Preferences</div></div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Roles</label>
                <input className="form-input" value={(profile?.preferredRoles || []).join(', ')} onChange={e => update('preferredRoles', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="e.g. Software Developer, Data Analyst" />
                <div className="form-hint">Comma-separated</div>
              </div>
              <div className="form-group">
                <label className="form-label">Preferred Locations</label>
                <input className="form-input" value={(profile?.preferredLocations || []).join(', ')} onChange={e => update('preferredLocations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="e.g. Chennai, Bangalore" />
                <div className="form-hint">Comma-separated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
