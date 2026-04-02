import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { FileText, Download } from 'lucide-react';

export default function PlacementReports() {
  const reports = [
    { name: 'Overall Placement Summary', desc: 'Complete placement statistics for the current batch', type: 'PDF' },
    { name: 'Department-wise Report', desc: 'Detailed breakdown by department with charts', type: 'Excel' },
    { name: 'Company Hiring Report', desc: 'Company-wise hiring statistics and CTC details', type: 'PDF' },
    { name: 'Student Placement List', desc: 'List of all placed students with offer details', type: 'Excel' },
    { name: 'Unplaced Students Report', desc: 'Students yet to be placed with profile analysis', type: 'Excel' },
    { name: 'Package Analysis Report', desc: 'CTC distribution, trends, and comparisons', type: 'PDF' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Placement Reports</h1>
        <p className="page-subtitle">Generate and download placement analytics reports</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 16 }}>
        {reports.map((r, i) => (
          <div className="card" key={i}>
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{r.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.desc}</div>
              </div>
              <button className="btn btn-secondary btn-sm"><Download size={14} /> {r.type}</button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
