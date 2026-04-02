import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { BarChart3 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DepartmentAnalytics() {
  const [deptStats, setDeptStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/department-stats').then(r => { setDeptStats(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  const selectionData = {
    labels: deptStats.map(d => d.department),
    datasets: [{
      label: 'Selection Rate %',
      data: deptStats.map(d => d.total > 0 ? Math.round(d.placed / d.total * 100) : 0),
      backgroundColor: deptStats.map(d => {
        const rate = d.total > 0 ? d.placed / d.total * 100 : 0;
        return rate >= 70 ? 'rgba(16,185,129,0.7)' : rate >= 40 ? 'rgba(245,158,11,0.7)' : 'rgba(239,68,68,0.7)';
      }),
      borderRadius: 6, borderSkipped: false,
    }],
  };

  const avgCTCData = {
    labels: deptStats.map(d => d.department),
    datasets: [{
      label: 'Avg CTC (LPA)',
      data: deptStats.map(d => (d.avgCTC / 100000).toFixed(1)),
      backgroundColor: 'rgba(99,102,241,0.7)',
      borderRadius: 6, borderSkipped: false,
    }],
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Department Analytics</h1>
        <p className="page-subtitle">Comparative placement metrics across departments</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Selection Rate by Department</div></div>
          <div className="card-body"><div style={{ height: 280 }}>
            <Bar data={selectionData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, grid: { color: 'var(--border-light)' } }, x: { grid: { display: false } } } }} />
          </div></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Average CTC by Department</div></div>
          <div className="card-body"><div style={{ height: 280 }}>
            <Bar data={avgCTCData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: 'var(--border-light)' } }, x: { grid: { display: false } } } }} />
          </div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Department Comparison Table</div></div>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>Department</th><th>Total</th><th>Eligible</th><th>Placed</th><th>Selection Rate</th><th>Avg CTC</th><th>Participation</th></tr></thead>
            <tbody>
              {deptStats.map((d, i) => {
                const rate = d.total > 0 ? Math.round(d.placed / d.total * 100) : 0;
                return (
                  <tr key={i}>
                    <td className="font-semibold">{d.department}</td>
                    <td>{d.total}</td>
                    <td>{d.eligible}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{d.placed}</td>
                    <td><span className={`badge ${rate >= 70 ? 'badge-selected' : rate >= 40 ? 'badge-pending' : 'badge-rejected'}`}>{rate}%</span></td>
                    <td>₹{(d.avgCTC / 100000).toFixed(1)}L</td>
                    <td>{d.participationRate || 0}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
