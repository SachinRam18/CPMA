import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Building2, Save, CheckCircle2 } from 'lucide-react';

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get('/companies/my').then(r => { setCompany(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const update = (k, v) => setCompany(c => ({ ...c, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (company?._id) {
        await api.put(`/companies/${company._id}`, company);
      } else {
        const res = await api.post('/companies', company);
        setCompany(res.data);
      }
      setMsg('Saved!');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) { setMsg('Error saving'); }
    setSaving(false);
  };

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:300}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div><h1 className="page-title">Company Profile</h1><p className="page-subtitle">Manage your company information</p></div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>

      {msg && <div style={{ padding: '10px 16px', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.85rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle2 size={16} /> {msg}</div>}

      <div className="card">
        <div className="card-body">
          <div className="form-row">
            <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" value={company?.name || ''} onChange={e => update('name', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Industry</label><input className="form-input" value={company?.industry || ''} onChange={e => update('industry', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Website</label><input className="form-input" value={company?.website || ''} onChange={e => update('website', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">City</label><input className="form-input" value={company?.city || ''} onChange={e => update('city', e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={company?.description || ''} onChange={e => update('description', e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Contact Person</label><input className="form-input" value={company?.contactPerson || ''} onChange={e => update('contactPerson', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Contact Email</label><input className="form-input" value={company?.contactEmail || ''} onChange={e => update('contactEmail', e.target.value)} /></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
