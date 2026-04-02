import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Briefcase, Users, MapPin, Clock, DollarSign } from 'lucide-react';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs').then(r => { setJobs(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:300}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div><h1 className="page-title">My Job Postings</h1><p className="page-subtitle">{jobs.length} jobs posted</p></div>
          <Link to="/recruiter/post-job" className="btn btn-primary"><Briefcase size={16} /> Post New Job</Link>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="card"><div className="empty-state"><div className="empty-state-icon"><Briefcase /></div><div className="empty-state-title">No jobs posted yet</div><Link to="/recruiter/post-job" className="btn btn-primary mt-3">Post Your First Job</Link></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map(job => (
            <div className="card" key={job._id}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}><Briefcase size={22} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span className="font-semibold">{job.title}</span>
                    <span className={`badge badge-${job.status}`}>{job.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} /> ₹{(job.ctcMin/100000).toFixed(1)}L - ₹{(job.ctcMax/100000).toFixed(1)}L</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {job.rolesCount} positions</span>
                    {job.deadline && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {new Date(job.deadline).toLocaleDateString()}</span>}
                  </div>
                </div>
                <Link to="/recruiter/applicants" className="btn btn-secondary btn-sm">View Applicants</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
