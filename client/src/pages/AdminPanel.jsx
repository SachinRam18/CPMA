import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleToggleActive = async (id) => {
    try {
      const res = await api.put(`/admin/user/${id}/toggle`);
      setUsers(users.map(u => u._id === id ? { ...u, isActive: res.data.user.isActive } : u));
    } catch (err) { alert(err.response?.data?.message || 'Failed to toggle'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete user and all related data?')) return;
    try {
      await api.delete(`/admin/user/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) { alert(err.response?.data?.message || 'Failed to delete user'); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>
      
      {loading ? <p>Loading users...</p> : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user._id} className={!user.isActive ? 'bg-gray-50 opacity-75' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="uppercase text-xs font-bold tracking-wide text-gray-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.isActive ? 
                      <span className="text-green-600 font-semibold text-xs border border-green-200 bg-green-50 px-2 py-1 rounded">Active</span> : 
                      <span className="text-red-600 font-semibold text-xs border border-red-200 bg-red-50 px-2 py-1 rounded">Suspended</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleToggleActive(user._id)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      {user.isActive ? 'Suspend' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
