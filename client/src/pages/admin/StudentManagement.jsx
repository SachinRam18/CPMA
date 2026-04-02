import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import api from '../../utils/api';
import { Users, Search, CheckCircle2, XCircle, AlertTriangle, FileText, Shield, ShieldOff } from 'lucide-react';

export default function StudentManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('student');

  useEffect(() => {
    api.get('/admin/users').then(r => { setUsers(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const res = await api.put(`/admin/user/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (err) { console.error(err); }
  };

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  if (loading) return <DashboardLayout><div className="skeleton skeleton-card" style={{height:400}}></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">{users.length} total users registered</p>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input className="filter-input" style={{ width: 280 }} placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'student', 'recruiter', 'admin'].map(r => (
          <button key={r} className={`filter-chip ${roleFilter === r ? 'active' : ''}`} onClick={() => setRoleFilter(r)}>
            {r === 'all' ? 'All Users' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="table-user">
                      <div className="table-avatar">{u.name?.[0]?.toUpperCase()}</div>
                      <div><div className="table-user-name">{u.name}</div><div className="table-user-sub">{u.email}</div></div>
                    </div>
                  </td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-upcoming' : u.role === 'recruiter' ? 'badge-shortlisted' : 'badge-applied'}`}>{u.role}</span></td>
                  <td><span className={`badge ${u.isActive ? 'badge-active' : 'badge-rejected'}`}>{u.isActive ? 'Active' : 'Disabled'}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-success'}`} onClick={() => toggleUser(u._id)} style={{ fontSize: '0.75rem' }}>
                      {u.isActive ? <><ShieldOff size={13} /> Disable</> : <><Shield size={13} /> Enable</>}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon"><Users /></div><div className="empty-state-title">No users found</div></div>}
      </div>
    </DashboardLayout>
  );
}
