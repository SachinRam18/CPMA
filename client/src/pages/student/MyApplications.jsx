import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { ClipboardList, Building2, MapPin, Calendar, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  applied: { label: 'Applied', class: 'badge-applied' },
  screening: { label: 'Screening', class: 'badge-screening' },
  shortlisted: { label: 'Shortlisted', class: 'badge-shortlisted' },
  test: { label: 'Test Round', class: 'badge-test' },
  technical: { label: 'Technical', class: 'badge-technical' },
  hr: { label: 'HR Round', class: 'badge-hr' },
  selected: { label: 'Selected', class: 'badge-selected' },
  offered: { label: 'Offered', class: 'badge-offered' },
  rejected: { label: 'Rejected', class: 'badge-rejected' },
  withdrawn: { label: 'Withdrawn', class: 'badge-withdrawn' },
};

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/applications').then(r => { setApps(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filters = ['all', 'applied', 'shortlisted', 'test', 'technical', 'hr', 'selected', 'rejected'];
  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  const pipeline = ['applied', 'screening', 'shortlisted', 'test', 'technical', 'hr', 'selected'];
  const pipelineCounts = pipeline.map(s => apps.filter(a => a.status === s).length);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">My Applications</h1>
            <p className="page-subtitle">{apps.length} total applications</p>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="pipeline" style={{ marginBottom: 24 }}>
        {pipeline.map((stage, i) => (
          <div className={`pipeline-stage ${filter === stage ? 'active' : ''}`} key={stage} onClick={() => setFilter(filter === stage ? 'all' : stage)} style={{ cursor: 'pointer' }}>
            <div className="pipeline-stage-count">{pipelineCounts[i]}</div>
            <div className="pipeline-stage-label">{STATUS_CONFIG[stage]?.label || stage}</div>
          </div>
        ))}
      </div>

      <div className="filter-bar">
        {filters.map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : STATUS_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><ClipboardList /></div>
          <div className="empty-state-title">No applications found</div>
          <div className="empty-state-text">You haven't applied to any jobs yet. Start exploring eligible positions.</div>
        </div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((app) => {
            const job = app.job || {};
            const cfg = STATUS_CONFIG[app.status] || { label: app.status, class: 'badge-applied' };
            return (
              <div className="card" key={app._id}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <Building2 size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{job.title || 'Job'}</span>
                      <span className={`badge ${cfg.class}`}>{cfg.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> {job.companyName || job.company || 'Company'}</span>
                      {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {job.location}</span>}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Round {app.currentRound || 0}/{app.totalRounds || '?'}</div>
                    <div className="progress-bar-track" style={{ width: 80, height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${app.totalRounds ? (app.currentRound / app.totalRounds) * 100 : 0}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
