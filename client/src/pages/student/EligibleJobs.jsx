import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, XCircle, Building2, Star, Search, Filter } from 'lucide-react';

export default function EligibleJobs() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [applying, setApplying] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications'),
    ]).then(([jRes, aRes]) => {
      setJobs(jRes.data || []);
      setApplications(aRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const appliedJobIds = new Set(applications.map(a => a.job?._id || a.job));

  const applyToJob = async (jobId) => {
    setApplying(jobId);
    try {
      await api.post(`/jobs/apply/${jobId}`);
      setApplications(prev => [...prev, { job: { _id: jobId }, status: 'applied' }]);
      setMsg({ text: 'Application submitted successfully!', type: 'success' });
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Failed to apply', type: 'error' });
    }
    setApplying(null);
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const formatCTC = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    const fmt = (v) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : `₹${v}`;
    return `${fmt(min)} - ${fmt(max)}`;
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase()) || j.companyName?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  if (loading) {
    return <DashboardLayout>
      <div className="page-header"><div className="skeleton skeleton-title"></div></div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card" style={{ height: 200 }}></div>)}
      </div>
    </DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Eligible Jobs</h1>
            <p className="page-subtitle">{filtered.length} jobs matching your profile</p>
          </div>
        </div>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 16px', background: msg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)', borderRadius: 'var(--radius-md)', color: msg.type === 'success' ? 'var(--success)' : 'var(--danger)', fontSize: '0.85rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          {msg.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {msg.text}
        </div>
      )}

      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="filter-input" style={{ width: '100%' }} placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card"><div className="empty-state">
          <div className="empty-state-icon"><Briefcase size={28} /></div>
          <div className="empty-state-title">No eligible jobs found</div>
          <div className="empty-state-text">Check back later for new opportunities matching your profile.</div>
        </div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
          {filtered.map((job) => {
            const isApplied = appliedJobIds.has(job._id);
            const deadline = job.deadline ? new Date(job.deadline) : null;
            const isExpired = deadline && deadline < new Date();

            return (
              <div className="card" key={job._id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-body" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 4 }}>{job.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
                        <Building2 size={14} /> {job.companyName || 'Company'}
                      </div>
                    </div>
                    <span className={`badge ${job.status === 'open' ? 'badge-active' : 'badge-closed'}`}>{job.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} /> {job.location || 'N/A'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} /> {formatCTC(job.ctcMin, job.ctcMax)}</span>
                    {deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: isExpired ? 'var(--danger)' : 'inherit' }}><Clock size={14} /> {deadline.toLocaleDateString()}</span>}
                  </div>

                  {job.eligibilityCriteria?.departments?.length > 0 && (
                    <div className="tags-list" style={{ marginBottom: 12 }}>
                      {job.eligibilityCriteria.departments.map((d, i) => <span className="tag" key={i}>{d}</span>)}
                      {job.eligibilityCriteria.minCGPA > 0 && <span className="tag">Min CGPA: {job.eligibilityCriteria.minCGPA}</span>}
                    </div>
                  )}

                  {job.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 0 }}>{job.description.slice(0, 120)}...</p>}
                </div>

                <div className="card-footer" style={{ display: 'flex', gap: 8 }}>
                  {isApplied ? (
                    <button className="btn btn-success btn-sm" disabled style={{ flex: 1 }}>
                      <CheckCircle2 size={14} /> Applied
                    </button>
                  ) : isExpired ? (
                    <button className="btn btn-secondary btn-sm" disabled style={{ flex: 1 }}>Deadline Passed</button>
                  ) : (
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => applyToJob(job._id)} disabled={applying === job._id}>
                      {applying === job._id ? 'Applying...' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
