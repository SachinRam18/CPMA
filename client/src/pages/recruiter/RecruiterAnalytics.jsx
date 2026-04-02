import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { BarChart3, Users, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function RecruiterAnalytics() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications').then(r => { setApps(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  const statusCounts = {};
  apps.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });

  const conversionData = {
    labels: ['Applied', 'Shortlisted', 'Test', 'Technical', 'HR', 'Selected'],
    datasets: [{
      label: 'Candidates',
      data: [
        apps.length,
        apps.filter(a => ['shortlisted','test','technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['test','technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['technical','hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['hr','selected','offered'].includes(a.status)).length,
        apps.filter(a => ['selected','offered'].includes(a.status)).length,
      ],
      backgroundColor: ['#6366f1','#818cf8','#a78bfa','#c4b5fd','#8b5cf6','#10b981'],
      borderRadius: 6, borderSkipped: false,
    }],
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Hiring Analytics</h1>
        <p className="page-subtitle">Track your recruitment performance metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-card-content"><div className="stat-card-label">Total Received</div><div className="stat-card-value">{apps.length}</div></div><div className="stat-card-icon primary"><Users /></div></div>
        <div className="stat-card"><div className="stat-card-content"><div className="stat-card-label">Conversion Rate</div><div className="stat-card-value">{apps.length > 0 ? Math.round(((statusCounts.selected||0)+(statusCounts.offered||0)) / apps.length * 100) : 0}%</div></div><div className="stat-card-icon success"><TrendingUp /></div></div>
        <div className="stat-card"><div className="stat-card-content"><div className="stat-card-label">Rejection Rate</div><div className="stat-card-value">{apps.length > 0 ? Math.round((statusCounts.rejected||0) / apps.length * 100) : 0}%</div></div><div className="stat-card-icon danger"><BarChart3 /></div></div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Hiring Funnel</div><div className="card-subtitle">Candidate flow from application to selection</div></div>
        <div className="card-body"><div style={{ height: 300 }}>
          <Bar data={conversionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'var(--border-light)' } }, x: { grid: { display: false } } } }} />
        </div></div>
      </div>
    </DashboardLayout>
  );
}
