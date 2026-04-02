import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Settings</h1>
        <p className="page-subtitle">System configuration and preferences</p>
      </div>
      <div className="card"><div className="card-body">
        <div className="form-group">
          <label className="form-label">College Name</label>
          <input className="form-input" value="PSG Institute of Technology and Applied Research" disabled />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Current Batch</label>
            <input className="form-input" value="2026" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Placement Year</label>
            <input className="form-input" value="2025-2026" disabled />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Default Minimum CGPA</label>
          <input className="form-input" type="number" defaultValue="6.0" />
        </div>
        <button className="btn btn-primary"><Settings size={16} /> Save Settings</button>
      </div></div>
    </DashboardLayout>
  );
}
