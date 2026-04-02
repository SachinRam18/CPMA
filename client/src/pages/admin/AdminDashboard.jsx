import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import {
  Users, GraduationCap, Building2, Briefcase, Award, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, XCircle, Target, BarChart3, Clock, FileText
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [deptStats, setDeptStats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/department-stats'),
      api.get('/admin/alerts'),
    ]).then(([s, d, a]) => {
      setStats(s.data);
      setDeptStats(d.data || []);
      setAlerts(a.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <DashboardLayout>
      <div className="page-header"><div className="skeleton skeleton-title"></div></div>
      <div className="stats-grid">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton skeleton-card"></div>)}</div>
    </DashboardLayout>;
  }

  const s = stats || {};

  const deptChartData = {
    labels: deptStats.map(d => d.department),
    datasets: [
      { label: 'Total', data: deptStats.map(d => d.total), backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4, borderSkipped: false },
      { label: 'Placed', data: deptStats.map(d => d.placed), backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4, borderSkipped: false },
      { label: 'Unplaced', data: deptStats.map(d => d.total - d.placed), backgroundColor: 'rgba(239,68,68,0.5)', borderRadius: 4, borderSkipped: false },
    ],
  };

  const placementRatioData = {
    labels: ['Placed', 'Unplaced', 'Opted Out'],
    datasets: [{
      data: [s.placedStudents || 0, s.unplacedStudents || 0, s.optedOut || 0],
      backgroundColor: ['#10b981', '#ef4444', '#94a3b8'],
      borderWidth: 0, cutout: '70%',
    }],
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">Placement Command Center</h1>
            <p className="page-subtitle">PSG Institute of Technology and Applied Research — Batch 2026</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="stat-card" style={{'--stat-accent':'var(--primary)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Total Students</div><div className="stat-card-value">{s.totalStudents || 0}</div></div>
          <div className="stat-card-icon primary"><GraduationCap /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--success)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Placed</div><div className="stat-card-value">{s.placedStudents || 0}</div>
          <div className="stat-card-change positive"><TrendingUp size={12} /> {s.totalStudents > 0 ? Math.round((s.placedStudents || 0) / s.totalStudents * 100) : 0}% rate</div></div>
          <div className="stat-card-icon success"><CheckCircle2 /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--danger)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Unplaced</div><div className="stat-card-value">{s.unplacedStudents || 0}</div></div>
          <div className="stat-card-icon danger"><XCircle /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--info)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Active Drives</div><div className="stat-card-value">{s.activeDrives || 0}</div></div>
          <div className="stat-card-icon info"><Briefcase /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'var(--warning)'}}>
          <div className="stat-card-content"><div className="stat-card-label">Total Offers</div><div className="stat-card-value">{s.totalOffers || 0}</div></div>
          <div className="stat-card-icon warning"><Award /></div>
        </div>
        <div className="stat-card" style={{'--stat-accent':'#8b5cf6'}}>
          <div className="stat-card-content"><div className="stat-card-label">Companies</div><div className="stat-card-value">{s.totalCompanies || 0}</div></div>
          <div className="stat-card-icon accent"><Building2 /></div>
        </div>
      </div>

      {/* Package Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
        <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Highest Package</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--success)' }}>₹{((s.highestPackage || 0) / 100000).toFixed(1)}L</div>
        </div></div>
        <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Average Package</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>₹{((s.avgPackage || 0) / 100000).toFixed(1)}L</div>
        </div></div>
        <div className="card"><div className="card-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Total Applications</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--info)' }}>{s.totalApplications || 0}</div>
        </div></div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 24 }}>
        {/* Department Chart */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Department-wise Placement Status</div>
            <div className="card-subtitle">Placed vs unplaced students by department</div></div>
          </div>
          <div className="card-body">
            <div style={{ height: 300 }}>
              <Bar data={deptChartData} options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'var(--border-light)' } },
                  x: { grid: { display: false } },
                },
              }} />
            </div>
          </div>
        </div>

        {/* Placement Ratio */}
        <div className="card">
          <div className="card-header"><div className="card-title">Placement Ratio</div></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 180, height: 180, position: 'relative' }}>
              <Doughnut data={placementRatioData} options={{ plugins: { legend: { display: false } }, maintainAspectRatio: true }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.totalStudents > 0 ? Math.round((s.placedStudents || 0) / s.totalStudents * 100) : 0}%</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Placed</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, marginTop: 20, fontSize: '0.8rem' }}>
              {[{ c: '#10b981', l: 'Placed' }, { c: '#ef4444', l: 'Unplaced' }, { c: '#94a3b8', l: 'Opted Out' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.c }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Table */}
      {deptStats.length > 0 && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <div><div className="card-title">Department Breakdown</div>
            <div className="card-subtitle">Detailed placement metrics by department</div></div>
          </div>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead><tr>
                <th>Department</th><th>Total</th><th>Eligible</th><th>Placed</th><th>Unplaced</th><th>Rate</th><th>Avg CTC</th><th>Status</th>
              </tr></thead>
              <tbody>
                {deptStats.map((d, i) => {
                  const rate = d.total > 0 ? Math.round(d.placed / d.total * 100) : 0;
                  return (
                    <tr key={i}>
                      <td><span className="font-semibold">{d.department}</span></td>
                      <td>{d.total}</td>
                      <td>{d.eligible}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 600 }}>{d.placed}</td>
                      <td style={{ color: d.total - d.placed > 0 ? 'var(--danger)' : 'inherit' }}>{d.total - d.placed}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="progress-bar-track" style={{ width: 60, height: 4 }}>
                            <div className={`progress-bar-fill ${rate >= 70 ? 'success' : rate >= 40 ? 'warning' : 'danger'}`} style={{ width: `${rate}%` }}></div>
                          </div>
                          <span className="text-sm font-semibold">{rate}%</span>
                        </div>
                      </td>
                      <td>₹{((d.avgCTC || 0) / 100000).toFixed(1)}L</td>
                      <td><span className={`badge ${rate >= 70 ? 'badge-active' : rate >= 40 ? 'badge-pending' : 'badge-rejected'}`}>{rate >= 70 ? 'Good' : rate >= 40 ? 'Average' : 'Low'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Alerts & Insights */}
      <div className="card">
        <div className="card-header">
          <div><div className="card-title">⚡ Actionable Insights & Alerts</div>
          <div className="card-subtitle">Issues requiring your attention</div></div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {alerts.length > 0 ? alerts.map((alert, i) => (
              <div className="insight-card" key={i}>
                <div className={`insight-card-icon ${alert.severity || 'warning'}`}>
                  {alert.severity === 'danger' ? <XCircle size={18} /> : alert.severity === 'info' ? <Target size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="insight-card-content">
                  <div className="insight-card-text">{alert.message}</div>
                </div>
              </div>
            )) : (
              <>
                <div className="insight-card"><div className="insight-card-icon warning"><AlertTriangle size={18} /></div>
                  <div className="insight-card-content"><div className="insight-card-text">Multiple students have incomplete profiles. Profile verification pending for the batch.</div></div></div>
                <div className="insight-card"><div className="insight-card-icon danger"><XCircle size={18} /></div>
                  <div className="insight-card-content"><div className="insight-card-text">Some students are eligible but haven't applied to any active drives. Consider sending reminders.</div></div></div>
                <div className="insight-card"><div className="insight-card-icon info"><Target size={18} /></div>
                  <div className="insight-card-content"><div className="insight-card-text">New drives from Google India and Zoho Corporation are active. Ensure student awareness.</div></div></div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
