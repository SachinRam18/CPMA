import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Building2, Globe, Users, MapPin } from 'lucide-react';

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/companies').then(r => { setCompanies(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Companies & Recruiters</h1>
        <p className="page-subtitle">{companies.length} partner companies</p>
      </div>

      {companies.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon"><Building2 /></div><div className="empty-state-title">No companies yet</div></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
          {companies.map(c => (
            <div className="card" key={c._id}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--primary-bg), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                    {c.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem' }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.industry}</div>
                  </div>
                  <span className={`badge ${c.isActive ? 'badge-active' : 'badge-inactive'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {c.city && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {c.city}</span>}
                  {c.size && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {c.size}</span>}
                  {c.website && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={13} /> <a href={c.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Website</a></span>}
                </div>
                {c.contactPerson && <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
                  <span style={{ fontWeight: 500 }}>Contact:</span> {c.contactPerson} · {c.contactEmail}
                </div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
