import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Star } from 'lucide-react';

export default function Bookmarks() {
  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Bookmarked Jobs</h1>
        <p className="page-subtitle">Jobs you've saved for later</p>
      </div>
      <div className="card"><div className="empty-state">
        <div className="empty-state-icon"><Star /></div>
        <div className="empty-state-title">No bookmarks yet</div>
        <div className="empty-state-text">Browse eligible jobs and bookmark the ones you're interested in for quick access.</div>
      </div></div>
    </DashboardLayout>
  );
}
