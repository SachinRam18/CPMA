import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Award, Building2, MapPin, CheckCircle2, XCircle, DollarSign, Calendar } from 'lucide-react';

export default function OffersResults() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications').then(r => { setApps(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const offers = apps.filter(a => a.status === 'selected' || a.status === 'offered');
  const rejected = apps.filter(a => a.status === 'rejected');

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:300}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Offers & Results</h1>
        <p className="page-subtitle">Track your placement outcomes and offers</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{'--stat-accent':'var(--success)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Offers Received</div><div className="stat-card-value">{offers.length}</div></div>
          <div className="stat-card-icon success"><Award /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--danger)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Rejections</div><div className="stat-card-value">{rejected.length}</div></div>
          <div className="stat-card-icon danger"><XCircle /></div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16, marginTop: 24 }}>
        {offers.length > 0 ? '🎉 Congratulations! Your Offers' : 'Offers'}
      </h2>
      {offers.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><Award /></div>
          <div className="empty-state-title">No offers yet</div>
          <div className="empty-state-text">Keep applying and performing well in interviews. Your offer is coming!</div>
        </div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16, marginBottom: 32 }}>
          {offers.map(app => (
            <div className="card" key={app._id} style={{ borderLeft: '4px solid var(--success)' }}>
              <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}><Award size={22} /></div>
                  <div><div style={{ fontWeight: 600 }}>{app.job?.title || 'Position'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{app.job?.companyName || 'Company'}</div></div>
                  <span className="badge badge-selected ml-auto">Selected</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {app.job?.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {app.job.location}</span>}
                  {app.job?.ctcMax && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} /> ₹{(app.job.ctcMax/100000).toFixed(1)}L</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejected.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Past Results</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rejected.map(app => (
              <div className="card" key={app._id}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
                  <XCircle size={20} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{app.job?.title || 'Position'}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem', marginLeft: 8 }}>{app.job?.companyName}</span>
                  </div>
                  <span className="badge badge-rejected">Rejected</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Round {app.currentRound}/{app.totalRounds}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
