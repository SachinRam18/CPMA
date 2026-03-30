import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If this is the layout wrapper, render Sidebar and Outlet, else just render Outlet for nested rules
  if (!allowedRoles) {
    return (
      <div className="flex bg-gray-50 min-h-[100vh]">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 md:ml-64 w-full h-full min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
