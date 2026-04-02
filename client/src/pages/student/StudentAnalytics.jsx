import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { BarChart3, Target, Lightbulb, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StudentAnalytics() {
  const [profile, setProfile] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/profile').catch(() => ({ data: null })),
      api.get('/applications').catch(() => ({ data: [] })),
    ]).then(([p, a]) => { setProfile(p.data); setApps(a.data || []); setLoading(false); });
  }, []);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  const scores = profile?.performanceScores || { aptitude: 0, coding: 0, communication: 0, technical: 0 };
  const avgScore = Math.round((scores.aptitude + scores.coding + scores.communication + scores.technical) / 4);

  const statusCounts = {};
  apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

  const funnelData = {
    labels: ['Applied', 'Screened', 'Shortlisted', 'Tests', 'Interviews', 'Selected'],
    datasets: [{
      data: [
        apps.length,
        apps.filter(a => a.status !== 'applied').length,
        apps.filter(a => ['shortlisted','test','technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['test','technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['selected','offered'].includes(a.status)).length,
      ],
      backgroundColor: ['#3b82f6','#6366f1','#8b5cf6','#a855f7','#d946ef','#10b981'],
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const skillGaps = [];
  if (scores.coding < 50) skillGaps.push({ area: 'Coding & DSA', score: scores.coding, tip: 'Practice on LeetCode, HackerRank. Focus on arrays, strings, and trees.' });
  if (scores.aptitude < 50) skillGaps.push({ area: 'Aptitude', score: scores.aptitude, tip: 'Work on quantitative aptitude, logical reasoning, and verbal ability.' });
  if (scores.communication < 50) skillGaps.push({ area: 'Communication', score: scores.communication, tip: 'Practice mock interviews, GD sessions. Work on articulation and confidence.' });
  if (scores.technical < 50) skillGaps.push({ area: 'Technical Knowledge', score: scores.technical, tip: 'Revise core subjects: OS, DBMS, CN. Work on system design basics.' });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Performance Analytics</h1>
        <p className="page-subtitle">Detailed analysis of your placement preparation and performance</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{'--stat-accent':'var(--primary)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Average Score</div><div className="stat-card-value">{avgScore}%</div></div>
          <div className="stat-card-icon primary"><BarChart3 /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--success)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Total Applications</div><div className="stat-card-value">{apps.length}</div></div>
          <div className="stat-card-icon success"><Target /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--info)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Selection Rate</div><div className="stat-card-value">{apps.length > 0 ? Math.round((statusCounts.selected || 0) / apps.length * 100) : 0}%</div></div>
          <div className="stat-card-icon info"><TrendingUp /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--warning)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Skill Gaps</div><div className="stat-card-value">{skillGaps.length}</div></div>
          <div className="stat-card-icon warning"><AlertTriangle /></div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Performance by Area</div></div>
          <div className="card-body">
            {Object.entries(scores).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="text-sm font-medium" style={{ textTransform: 'capitalize' }}>{key}</span>
                  <span className="text-sm font-bold" style={{ color: val >= 70 ? 'var(--success)' : val >= 50 ? 'var(--warning)' : 'var(--danger)' }}>{val}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className={`progress-bar-fill ${val >= 70 ? 'success' : val >= 50 ? 'warning' : 'danger'}`} style={{ width: `${val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Application Funnel</div></div>
          <div className="card-body">
            <div style={{ height: 220 }}>
              <Bar data={funnelData} options={{
                responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Gap Analysis */}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">💡 Skill Gap Analysis & Improvement Plan</div>
          <div className="card-subtitle">Areas needing attention based on your performance data</div></div>
        </div>
        <div className="card-body">
          {skillGaps.length === 0 ? (
            <div className="insight-card"><div className="insight-card-icon success"><CheckCircle2 size={18} /></div>
              <div className="insight-card-content"><div className="insight-card-title">Great performance!</div>
              <div className="insight-card-text">All your scores are above the threshold. Keep practicing to maintain consistency.</div></div></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {skillGaps.map((gap, i) => (
                <div className="insight-card" key={i}>
                  <div className="insight-card-icon warning"><AlertTriangle size={18} /></div>
                  <div className="insight-card-content">
                    <div className="insight-card-title">{gap.area} — {gap.score}%</div>
                    <div className="insight-card-text">{gap.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
