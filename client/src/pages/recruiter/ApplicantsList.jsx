import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Users, Search, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const STATUS_CONFIG = {
  applied: { label: 'Applied', class: 'badge-applied' },
  screening: { label: 'Screening', class: 'badge-screening' },
  shortlisted: { label: 'Shortlisted', class: 'badge-shortlisted' },
  test: { label: 'Test', class: 'badge-test' },
  technical: { label: 'Technical', class: 'badge-technical' },
  hr: { label: 'HR', class: 'badge-hr' },
  selected: { label: 'Selected', class: 'badge-selected' },
  offered: { label: 'Offered', class: 'badge-offered' },
  rejected: { label: 'Rejected', class: 'badge-rejected' },
};

const NEXT_STATUS = {
  applied: 'shortlisted', screening: 'shortlisted', shortlisted: 'test',
  test: 'technical', technical: 'hr', hr: 'selected',
};

export default function ApplicantsList() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/applications').then(r => { setApps(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await api.put(`/applications/${id}`, { status });
      setApps(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) { console.error(err); }
    setUpdating(null);
  };

  const filtered = apps.filter(a => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch = !search || a.student?.name?.toLowerCase().includes(search.toLowerCase()) || a.student?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Applicants</h1>
        <p className="page-subtitle">{apps.length} total applications received</p>
      </div>

      {/* Pipeline */}
      <div className="pipeline" style={{ marginBottom: 20 }}>
        {Object.entries(STATUS_CONFIG).slice(0, 8).map(([key, cfg]) => {
          const c = apps.filter(a => a.status === key).length;
          return (
            <div className={`pipeline-stage ${filter === key ? 'active' : ''}`} key={key} onClick={() => setFilter(filter === key ? 'all' : key)} style={{ cursor: 'pointer' }}>
              <div className="pipeline-stage-count">{c}</div>
              <div className="pipeline-stage-label">{cfg.label}</div>
            </div>
          );
        })}
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="filter-input" style={{ width: 280 }} placeholder="Search candidates..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
      </div>

      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Candidate</th><th>Job</th><th>Status</th><th>Round</th><th>Applied</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a => {
                const cfg = STATUS_CONFIG[a.status] || { label: a.status, class: 'badge-applied' };
                const next = NEXT_STATUS[a.status];
                return (
                  <tr key={a._id}>
                    <td>
                      <div className="table-user">
                        <div className="table-avatar">{a.student?.name?.[0] || '?'}</div>
                        <div><div className="table-user-name">{a.student?.name || 'Student'}</div><div className="table-user-sub">{a.student?.email}</div></div>
                      </div>
                    </td>
                    <td className="text-sm">{a.job?.title || 'Job'}</td>
                    <td><span className={`badge ${cfg.class}`}>{cfg.label}</span></td>
                    <td className="text-sm">{a.currentRound || 0}/{a.totalRounds || '?'}</td>
                    <td className="text-sm text-tertiary">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {next && (
                          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(a._id, next)} disabled={updating === a._id} style={{ fontSize: '0.7rem' }}>
                            <ArrowRight size={12} /> {STATUS_CONFIG[next]?.label}
                          </button>
                        )}
                        {a.status !== 'rejected' && a.status !== 'selected' && a.status !== 'offered' && (
                          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(a._id, 'rejected')} disabled={updating === a._id} style={{ fontSize: '0.7rem' }}>
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon"><Users /></div><div className="empty-state-title">No applicants found</div></div>}
      </div>
    </DashboardLayout>
  );
}
