import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common
import Landing from './pages/common/Landing';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import EligibleJobs from './pages/student/EligibleJobs';
import MyApplications from './pages/student/MyApplications';
import StudentAnalytics from './pages/student/StudentAnalytics';
import OffersResults from './pages/student/OffersResults';
import Bookmarks from './pages/student/Bookmarks';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import CompanyManagement from './pages/admin/CompanyManagement';
import DriveManagement from './pages/admin/DriveManagement';
import DepartmentAnalytics from './pages/admin/DepartmentAnalytics';
import PlacementReports from './pages/admin/PlacementReports';
import AdminSettings from './pages/admin/AdminSettings';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import MyJobs from './pages/recruiter/MyJobs';
import ApplicantsList from './pages/recruiter/ApplicantsList';
import RecruiterAnalytics from './pages/recruiter/RecruiterAnalytics';
import CompanyProfile from './pages/recruiter/CompanyProfile';

function AuthRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={`/${user.role}/dashboard`} />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AuthRedirect />} />

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/jobs" element={<EligibleJobs />} />
            <Route path="/student/applications" element={<MyApplications />} />
            <Route path="/student/analytics" element={<StudentAnalytics />} />
            <Route path="/student/offers" element={<OffersResults />} />
            <Route path="/student/bookmarks" element={<Bookmarks />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
            <Route path="/admin/drives" element={<DriveManagement />} />
            <Route path="/admin/departments" element={<DepartmentAnalytics />} />
            <Route path="/admin/reports" element={<PlacementReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Recruiter Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/post-job" element={<PostJob />} />
            <Route path="/recruiter/jobs" element={<MyJobs />} />
            <Route path="/recruiter/applicants" element={<ApplicantsList />} />
            <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
            <Route path="/recruiter/company" element={<CompanyProfile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
