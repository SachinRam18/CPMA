import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-indigo-700 w-full md:w-64 h-auto md:h-screen flex-shrink-0 flex flex-col justify-between p-4 md:fixed top-0 left-0">
      <div>
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold tracking-tight">CPMS</h1>
          <p className="text-indigo-200 text-sm mt-1 capitalize">{user.role} Portal</p>
        </div>

        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">Dashboard</Link>
          </li>
          
          {user.role === 'student' && (
            <>
              <li><Link to="/profile" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">My Profile</Link></li>
              <li><Link to="/jobs" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">Find Jobs</Link></li>
              <li><Link to="/applications" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">My Applications</Link></li>
            </>
          )}

          {user.role === 'recruiter' && (
            <>
              <li><Link to="/jobs/post" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">Post a Job</Link></li>
              <li><Link to="/jobs" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">My Jobs</Link></li>
              <li><Link to="/applications" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">Review Applications</Link></li>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <li><Link to="/admin" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">User Management</Link></li>
            </>
          )}
          
          <li>
            <Link to="/notifications" className="block text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors">Notifications</Link>
          </li>
        </ul>
      </div>

      <div className="mt-8 border-t border-indigo-600 pt-4">
        <div className="text-indigo-200 text-sm px-4 mb-2 truncate">{user.email}</div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-white hover:bg-indigo-600 px-4 py-2 rounded transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
