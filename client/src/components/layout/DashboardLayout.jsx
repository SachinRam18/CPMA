import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Briefcase, Users, FileText, BarChart3, Bell, Settings,
  Building2, CalendarDays, GraduationCap, ClipboardList, BookOpen,
  Target, Award, LogOut, ChevronDown, Search, Menu, X, Star
} from 'lucide-react';

const studentNav = [
  { section: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/student/dashboard" },
    { label: "My Profile", icon: Users, path: "/student/profile" },
  ]},
  { section: "Placements", items: [
    { label: "Eligible Jobs", icon: Briefcase, path: "/student/jobs" },
    { label: "My Applications", icon: ClipboardList, path: "/student/applications" },
    { label: "Bookmarked", icon: Star, path: "/student/bookmarks" },
    { label: "Offers & Results", icon: Award, path: "/student/offers" },
  ]},
  { section: "Insights", items: [
    { label: "Analytics", icon: BarChart3, path: "/student/analytics" },
  ]},
];

const adminNav = [
  { section: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  ]},
  { section: "Management", items: [
    { label: "Students", icon: GraduationCap, path: "/admin/students" },
    { label: "Companies", icon: Building2, path: "/admin/companies" },
    { label: "Job Drives", icon: Briefcase, path: "/admin/drives" },
  ]},
  { section: "Analytics", items: [
    { label: "Departments", icon: BarChart3, path: "/admin/departments" },
    { label: "Reports", icon: FileText, path: "/admin/reports" },
  ]},
  { section: "System", items: [
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ]},
];

const recruiterNav = [
  { section: "Overview", items: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/recruiter/dashboard" },
  ]},
  { section: "Hiring", items: [
    { label: "Post Job", icon: Briefcase, path: "/recruiter/post-job" },
    { label: "My Jobs", icon: ClipboardList, path: "/recruiter/jobs" },
    { label: "Applicants", icon: Users, path: "/recruiter/applicants" },
  ]},
  { section: "Insights", items: [
    { label: "Analytics", icon: BarChart3, path: "/recruiter/analytics" },
    { label: "Company Profile", icon: Building2, path: "/recruiter/company" },
  ]},
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const navItems = user?.role === 'admin' ? adminNav :
                   user?.role === 'recruiter' ? recruiterNav : studentNav;

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">CP</div>
          <div className="sidebar-logo-text">
            CPMA
            <span>PSG iTAR Placements</span>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {navItems.map((section, si) => (
            <div className="sidebar-section" key={si}>
              <div className="sidebar-section-title">{section.section}</div>
              <ul className="sidebar-nav">
                {section.items.map((item, ii) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={ii}>
                      <Link
                        to={item.path}
                        className={`sidebar-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-icon-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none' }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="topbar-search">
              <Search />
              <input type="text" placeholder="Search students, jobs, companies..." />
            </div>
          </div>

          <div className="topbar-right">
            {/* Notifications */}
            <div className="dropdown" ref={notifRef}>
              <button className="topbar-icon-btn" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>
              {showNotif && (
                <div className="notification-dropdown">
                  <div className="card-header">
                    <span className="card-title" style={{ fontSize: '0.9rem' }}>Notifications</span>
                    <button className="btn btn-ghost btn-sm">Mark all read</button>
                  </div>
                  <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                    <div className="notification-item unread">
                      <div className="notification-item-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
                        <Briefcase size={16} />
                      </div>
                      <div className="notification-item-content">
                        <div className="notification-item-text">New job posted: SDE-1 at Google India</div>
                        <div className="notification-item-time">2 hours ago</div>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-item-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                        <Award size={16} />
                      </div>
                      <div className="notification-item-content">
                        <div className="notification-item-text">You've been shortlisted for TCS Software Developer</div>
                        <div className="notification-item-time">1 day ago</div>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-item-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                        <CalendarDays size={16} />
                      </div>
                      <div className="notification-item-content">
                        <div className="notification-item-text">Deadline approaching: Wipro application closes in 3 days</div>
                        <div className="notification-item-time">2 days ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer" style={{ textAlign: 'center' }}>
                    <Link to={`/${user?.role}/notifications`} className="text-sm font-medium text-accent">View all notifications</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="dropdown" ref={profileRef}>
              <button className="topbar-profile" onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
                <div className="topbar-profile-avatar">{initials}</div>
                <div className="topbar-profile-info">
                  <div className="topbar-profile-name">{user?.name?.split(' ')[0]}</div>
                  <div className="topbar-profile-role">{user?.role}</div>
                </div>
                <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
              </button>
              {showProfile && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={() => { setShowProfile(false); navigate(`/${user?.role}/profile`); }}>
                    <Users size={16} /> Profile Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content animate-fadeIn">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }} onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}
