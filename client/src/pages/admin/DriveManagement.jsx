import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Briefcase, Building2, Calendar, Users, CheckCircle2 } from 'lucide-react';

export default function DriveManagement() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/drives').then(r => { setDrives(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? drives : drives.filter(d => d.status === filter);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Placement Drives</h1>
            <p className="page-subtitle">{drives.length} drives managed</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        {['all', 'upcoming', 'active', 'completed'].map(f => (
          <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? drives.length : drives.filter(d => d.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon"><Briefcase /></div><div className="empty-state-title">No drives found</div></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(drive => (
            <div className="card" key={drive._id}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: drive.status === 'active' ? 'var(--success-bg)' : drive.status === 'upcoming' ? 'var(--primary-bg)' : 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: drive.status === 'active' ? 'var(--success)' : drive.status === 'upcoming' ? 'var(--primary)' : 'var(--text-tertiary)', flexShrink: 0 }}>
                  <Briefcase size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{drive.title}</span>
                    <span className={`badge badge-${drive.status}`}>{drive.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {drive.company?.name && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={13} /> {drive.company.name}</span>}
                    {drive.schedule?.driveDate && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {new Date(drive.schedule.driveDate).toLocaleDateString()}</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {drive.totalPositions} positions</span>
                    {drive.ctcOffered && <span>💰 {drive.ctcOffered}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {drive.rounds?.length || 0} rounds
                  <div>{drive.eligibility?.departments?.join(', ')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
