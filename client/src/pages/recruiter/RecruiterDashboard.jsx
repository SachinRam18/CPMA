import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Users, Briefcase, CheckCircle2, XCircle, Clock, Award, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/jobs'),
      api.get('/applications'),
    ]).then(([j, a]) => { setJobs(j.data || []); setApps(a.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="stats-grid">{[1,2,3,4].map(i=><div key={i} className="skeleton skeleton-card"></div>)}</div></DashboardLayout>;

  const statusCounts = {};
  apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

  const pipelineStages = [
    { key: 'applied', label: 'Applied', count: statusCounts.applied || 0 },
    { key: 'screening', label: 'Screened', count: statusCounts.screening || 0 },
    { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted || 0 },
    { key: 'test', label: 'Test', count: statusCounts.test || 0 },
    { key: 'technical', label: 'Technical', count: statusCounts.technical || 0 },
    { key: 'hr', label: 'HR', count: statusCounts.hr || 0 },
    { key: 'selected', label: 'Selected', count: statusCounts.selected || 0 },
    { key: 'offered', label: 'Offered', count: statusCounts.offered || 0 },
  ];

  const outcomeData = {
    labels: ['In Process', 'Selected', 'Rejected'],
    datasets: [{
      data: [
        apps.filter(a => !['selected','offered','rejected'].includes(a.status)).length,
        (statusCounts.selected || 0) + (statusCounts.offered || 0),
        statusCounts.rejected || 0,
      ],
      backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
      borderWidth: 0, cutout: '70%',
    }],
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Recruiter Dashboard</h1>
            <p className="page-subtitle">Manage your campus hiring pipeline</p>
          </div>
          <Link to="/recruiter/post-job" className="btn btn-primary"><Briefcase size={16} /> Post New Job</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{'--stat-accent':'var(--primary)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Total Applicants</div><div className="stat-card-value">{apps.length}</div></div>
          <div className="stat-card-icon primary"><Users /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--info)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Active Jobs</div><div className="stat-card-value">{jobs.filter(j => j.status === 'open').length}</div></div>
          <div className="stat-card-icon info"><Briefcase /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--success)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Selected</div><div className="stat-card-value">{(statusCounts.selected || 0) + (statusCounts.offered || 0)}</div></div>
          <div className="stat-card-icon success"><CheckCircle2 /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--warning)'}}>
          <div className="stat-card-content"><div className="stat-card-label">In Pipeline</div><div className="stat-card-value">{apps.filter(a => !['selected','offered','rejected'].includes(a.status)).length}</div></div>
          <div className="stat-card-icon warning"><Clock /></div>
        </div>
      </div>

      {/* Hiring Pipeline */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header"><div className="card-title">Candidate Pipeline</div><div className="card-subtitle">Track candidates through hiring stages</div></div>
        <div className="card-body">
          <div className="pipeline">
            {pipelineStages.map((stage) => (
              <div className="pipeline-stage" key={stage.key}>
                <div className="pipeline-stage-count">{stage.count}</div>
                <div className="pipeline-stage-label">{stage.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Hiring Outcomes</div></div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 200, height: 200 }}><Doughnut data={outcomeData} options={{ plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } } } }} /></div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Posted Jobs</div></div>
          <div className="card-body">
            {jobs.length === 0 ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <div className="empty-state-title">No jobs posted yet</div>
                <Link to="/recruiter/post-job" className="btn btn-primary btn-sm mt-3">Post Your First Job</Link>
              </div>
            ) : (
              jobs.slice(0, 5).map(job => (
                <div key={job._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold text-sm">{job.title}</div>
                    <div className="text-xs text-tertiary">{job.location} · {job.rolesCount} positions</div>
                  </div>
                  <span className={`badge badge-${job.status}`}>{job.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
