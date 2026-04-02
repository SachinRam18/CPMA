import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import {
  Briefcase, ClipboardList, Award, Target, TrendingUp, TrendingDown,
  CheckCircle2, Clock, XCircle, AlertTriangle, FileText, Star,
  ChevronRight, Lightbulb, BarChart3, Eye, ArrowUpRight
} from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => ({ data: null })),
      api.get('/applications').catch(() => ({ data: [] })),
      api.get('/jobs').catch(() => ({ data: [] })),
    ]).then(([pRes, aRes, jRes]) => {
      setProfile(pRes.data);
      setApplications(aRes.data || []);
      setJobs(jRes.data || []);
      setLoading(false);
    });
  }, []);

  const calcProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.department, profile.cgpa > 0, profile.phone, profile.skills?.length > 0,
      profile.resume, profile.projects?.length > 0, profile.certifications?.length > 0,
      profile.tenthPercentage > 0, profile.twelfthPercentage > 0, profile.preferredRoles?.length > 0,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  const profileCompletion = calcProfileCompletion();
  const applied = applications.filter(a => !a.optedOut);
  const shortlisted = applied.filter(a => ['shortlisted', 'test', 'technical', 'hr'].includes(a.status));
  const selected = applied.filter(a => a.status === 'selected' || a.status === 'offered');
  const rejected = applied.filter(a => a.status === 'rejected');

  const readinessScore = Math.min(100, Math.round(
    (profileCompletion * 0.3) +
    ((profile?.performanceScores?.aptitude || 0) * 0.2) +
    ((profile?.performanceScores?.coding || 0) * 0.2) +
    ((profile?.performanceScores?.communication || 0) * 0.15) +
    ((profile?.performanceScores?.technical || 0) * 0.15)
  ));

  // Charts
  const outcomeData = {
    labels: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
    datasets: [{
      data: [
        applied.filter(a => a.status === 'applied' || a.status === 'screening').length,
        shortlisted.length,
        selected.length,
        rejected.length,
      ],
      backgroundColor: ['#3b82f6', '#6366f1', '#10b981', '#ef4444'],
      borderWidth: 0,
      cutout: '72%',
    }],
  };

  const performanceData = {
    labels: ['Aptitude', 'Coding', 'Communication', 'Technical'],
    datasets: [{
      label: 'Score',
      data: [
        profile?.performanceScores?.aptitude || 0,
        profile?.performanceScores?.coding || 0,
        profile?.performanceScores?.communication || 0,
        profile?.performanceScores?.technical || 0,
      ],
      backgroundColor: ['rgba(99,102,241,0.8)', 'rgba(139,92,246,0.8)', 'rgba(59,130,246,0.8)', 'rgba(16,185,129,0.8)'],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const insights = [];
  if (profileCompletion < 80) insights.push({ type: 'warning', icon: AlertTriangle, text: `Your profile is ${profileCompletion}% complete. Add missing details to increase visibility to recruiters.` });
  if (!profile?.resume) insights.push({ type: 'danger', icon: FileText, text: 'Resume not uploaded. Upload your resume to be eligible for applications.' });
  if ((profile?.performanceScores?.coding || 0) < 50 && (profile?.performanceScores?.aptitude || 0) > 60) insights.push({ type: 'info', icon: Lightbulb, text: 'Your aptitude scores are good, but coding performance is low. Focus on DSA practice.' });
  if (rejected.length > 2) insights.push({ type: 'warning', icon: Target, text: `You've been rejected from ${rejected.length} positions. Review feedback and focus on improvement areas.` });
  if (applied.length === 0 && jobs.length > 0) insights.push({ type: 'info', icon: Briefcase, text: `${jobs.length} jobs available. Start applying to begin your placement journey!` });
  if ((profile?.performanceScores?.communication || 0) < 45) insights.push({ type: 'info', icon: Lightbulb, text: 'Communication scores need improvement. Practice mock interviews and group discussions.' });
  if (insights.length === 0) insights.push({ type: 'success', icon: CheckCircle2, text: 'You\'re on track! Keep applying and preparing for upcoming drives.' });

  const journeySteps = [
    { label: 'Registered', completed: true },
    { label: 'Profile Verified', completed: profile?.profileVerified || false },
    { label: 'Eligible for Jobs', completed: jobs.length > 0 },
    { label: 'Applied', completed: applied.length > 0 },
    { label: 'Shortlisted', completed: shortlisted.length > 0 },
    { label: 'Interview', completed: shortlisted.some(a => ['technical', 'hr'].includes(a.status)) },
    { label: 'Selected', completed: selected.length > 0 },
    { label: 'Offer Accepted', completed: profile?.placementStatus === 'placed' },
  ];
  const currentStep = journeySteps.findLastIndex(s => s.completed);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="page-header"><div className="skeleton skeleton-title"></div></div>
        <div className="stats-grid">
          {[1,2,3,4].map(i => <div key={i} className="skeleton skeleton-card"></div>)}
        </div>
        <div className="grid-2"><div className="skeleton skeleton-chart"></div><div className="skeleton skeleton-chart"></div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="page-subtitle">Here's your placement journey overview — {profile?.department || 'Department'} Department</p>
          </div>
          <Link to="/student/jobs" className="btn btn-primary">
            <Briefcase size={16} /> Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ '--stat-accent': 'var(--primary)' }}>
          <div className="stat-card-content">
            <div className="stat-card-label">Eligible Jobs</div>
            <div className="stat-card-value">{jobs.length}</div>
            <div className="stat-card-change positive"><TrendingUp size={12} /> Active openings</div>
          </div>
          <div className="stat-card-icon primary"><Briefcase /></div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--info)' }}>
          <div className="stat-card-content">
            <div className="stat-card-label">Applied</div>
            <div className="stat-card-value">{applied.length}</div>
            <div className="stat-card-change positive"><ArrowUpRight size={12} /> {shortlisted.length} shortlisted</div>
          </div>
          <div className="stat-card-icon info"><ClipboardList /></div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--success)' }}>
          <div className="stat-card-content">
            <div className="stat-card-label">Selected</div>
            <div className="stat-card-value">{selected.length}</div>
            {selected.length > 0 && <div className="stat-card-change positive"><CheckCircle2 size={12} /> Offers received</div>}
          </div>
          <div className="stat-card-icon success"><Award /></div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': readinessScore > 60 ? 'var(--success)' : 'var(--warning)' }}>
          <div className="stat-card-content">
            <div className="stat-card-label">Readiness Score</div>
            <div className="stat-card-value">{readinessScore}%</div>
            <div className="progress-bar-track" style={{ marginTop: 8 }}>
              <div className={`progress-bar-fill ${readinessScore > 70 ? 'success' : readinessScore > 40 ? 'warning' : 'danger'}`} style={{ width: `${readinessScore}%` }}></div>
            </div>
          </div>
          <div className="stat-card-icon accent"><Target /></div>
        </div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 24 }}>
        {/* Placement Journey */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Placement Journey</div>
              <div className="card-subtitle">Track your progress through the placement process</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 0, overflow: 'auto' }}>
              {journeySteps.map((step, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative', minWidth: 80 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', margin: '0 auto 8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.completed ? 'var(--success)' : i === currentStep + 1 ? 'var(--primary)' : 'var(--border-light)',
                    color: step.completed || i === currentStep + 1 ? 'white' : 'var(--text-tertiary)',
                    fontSize: '0.75rem', fontWeight: 700,
                    boxShadow: i === currentStep + 1 ? '0 0 0 4px var(--primary-bg)' : 'none',
                  }}>
                    {step.completed ? <CheckCircle2 size={16} /> : i + 1}
                  </div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 500, color: step.completed ? 'var(--success)' : 'var(--text-tertiary)' }}>
                    {step.label}
                  </div>
                  {i < journeySteps.length - 1 && (
                    <div style={{
                      position: 'absolute', top: 16, left: '50%', width: '100%', height: 2,
                      background: step.completed ? 'var(--success)' : 'var(--border-light)',
                      zIndex: 0
                    }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Profile Status</div>
          </div>
          <div className="card-body" style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--border-light)" strokeWidth="10" />
                <circle cx="60" cy="60" r="52" fill="none"
                  stroke={profileCompletion > 70 ? 'var(--success)' : profileCompletion > 40 ? 'var(--warning)' : 'var(--danger)'}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${profileCompletion * 3.27} 327`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profileCompletion}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Complete</span>
              </div>
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
              {profile?.resume ? '✓ Resume uploaded' : '✗ Resume missing'}
            </div>
            <Link to="/student/profile" className="btn btn-secondary btn-sm btn-block">
              Complete Profile <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Application Outcomes */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Application Outcomes</div>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 160, height: 160, flexShrink: 0 }}>
              <Doughnut data={outcomeData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: true }} />
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: 'Applied / In Review', count: applied.filter(a => a.status === 'applied' || a.status === 'screening').length, color: '#3b82f6' },
                { label: 'Shortlisted', count: shortlisted.length, color: '#6366f1' },
                { label: 'Selected', count: selected.length, color: '#10b981' },
                { label: 'Rejected', count: rejected.length, color: '#ef4444' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }}></div>
                  <span style={{ flex: 1, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Performance Scores</div>
          </div>
          <div className="card-body">
            <div style={{ height: 200 }}>
              <Bar data={performanceData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, max: 100, grid: { color: 'var(--border-light)' }, ticks: { font: { size: 11 } } },
                  x: { grid: { display: false }, ticks: { font: { size: 11 } } },
                },
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Insights */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">💡 Smart Insights & Suggestions</div>
            <div className="card-subtitle">Personalized recommendations based on your profile and performance</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {insights.map((ins, i) => {
              const Icon = ins.icon;
              return (
                <div className="insight-card" key={i}>
                  <div className={`insight-card-icon ${ins.type}`}><Icon size={18} /></div>
                  <div className="insight-card-content">
                    <div className="insight-card-text">{ins.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Quick Actions</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { label: 'Complete Profile', icon: Eye, path: '/student/profile', color: 'var(--primary-bg)', iconColor: 'var(--primary)' },
              { label: 'Browse Jobs', icon: Briefcase, path: '/student/jobs', color: 'var(--success-bg)', iconColor: 'var(--success)' },
              { label: 'My Applications', icon: ClipboardList, path: '/student/applications', color: 'var(--info-bg)', iconColor: 'var(--info)' },
              { label: 'View Analytics', icon: BarChart3, path: '/student/analytics', color: 'var(--warning-bg)', iconColor: 'var(--warning)' },
              { label: 'Offers & Results', icon: Award, path: '/student/offers', color: 'rgba(139,92,246,0.1)', iconColor: 'var(--accent)' },
              { label: 'Bookmarked', icon: Star, path: '/student/bookmarks', color: 'var(--danger-bg)', iconColor: 'var(--danger)' },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <Link to={action.path} key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)', textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }} className="insight-card">
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: action.color, color: action.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
