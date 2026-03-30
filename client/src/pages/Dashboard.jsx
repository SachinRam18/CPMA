import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (user.role === 'admin') {
      api.get('/admin/stats').then(res => setStats(res.data)).catch(console.error);
    }
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-indigo-900 mb-2">Welcome back, {user.name}!</h2>
        <p className="text-indigo-700">You are logged in as a <span className="font-bold uppercase">{user.role}</span>.</p>
      </div>

      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-2">My Profile</h3>
            <p className="text-gray-500 text-sm mb-4">Keep your CGPA, skills, and resume updated for recruiters.</p>
            <Link to="/profile" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded">Edit Profile</Link>
          </div>
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Opportunities</h3>
            <p className="text-gray-500 text-sm mb-4">Browse jobs that match your eligibility criteria.</p>
            <Link to="/jobs" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded">Find Jobs</Link>
          </div>
        </div>
      )}

      {user.role === 'recruiter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Create Job Posting</h3>
            <p className="text-gray-500 text-sm mb-4">Attract top talent from various departments.</p>
            <Link to="/jobs/post" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded">Post a Job</Link>
          </div>
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Track Applicants</h3>
            <p className="text-gray-500 text-sm mb-4">Review, shortlist, and select best candidates.</p>
            <Link to="/applications" className="inline-block bg-indigo-600 text-white font-medium px-4 py-2 rounded">Review Applications</Link>
          </div>
        </div>
      )}

      {user.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</p>
            <p className="mt-2 text-4xl font-extrabold text-indigo-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Jobs</p>
            <p className="mt-2 text-4xl font-extrabold text-green-600">{stats.totalJobs}</p>
          </div>
          <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Applications</p>
            <p className="mt-2 text-4xl font-extrabold text-blue-600">{stats.totalApplications}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
