import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Building2, Shield, BarChart3, Briefcase, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: GraduationCap, title: 'Student Portal', desc: 'Track applications, view eligible jobs, get smart placement insights and improvement suggestions.', color: 'var(--primary-bg)', iconColor: 'var(--primary)' },
    { icon: Shield, title: 'Admin Dashboard', desc: 'Manage drives, monitor departments, track student progress with powerful analytics and alerts.', color: 'var(--warning-bg)', iconColor: 'var(--warning)' },
    { icon: Building2, title: 'Recruiter Panel', desc: 'Post jobs, filter candidates, manage hiring pipeline and track offer acceptances.', color: 'var(--success-bg)', iconColor: 'var(--success)' },
    { icon: BarChart3, title: 'Smart Analytics', desc: 'Department-wise stats, placement trends, package distribution, and actionable insights.', color: 'var(--info-bg)', iconColor: 'var(--info)' },
    { icon: Briefcase, title: 'Placement Workflow', desc: 'End-to-end drive management from job posting to offer acceptance with round tracking.', color: 'rgba(139,92,246,0.1)', iconColor: 'var(--accent)' },
    { icon: Users, title: 'Multi-Role Access', desc: 'Secure role-based access for students, placement officers, and company recruiters.', color: 'var(--danger-bg)', iconColor: 'var(--danger)' },
  ];

  return (
    <div>
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="sidebar-logo-icon" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>CP</div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>CPMA</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started <ArrowRight size={16} /></Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'var(--primary-bg)', borderRadius: 'var(--radius-full)', marginBottom: 24, fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary)' }}>
            <CheckCircle2 size={16} /> PSG Institute of Technology and Applied Research
          </div>
          <h1>
            Campus Placement<br />
            <span>Management System</span>
          </h1>
          <p>
            Streamline your entire placement process — from job postings and student applications to
            interview rounds, offers, and analytics. Built for modern placement cells.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Now <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 48 }}>
            {[
              { val: '500+', label: 'Students Placed' },
              { val: '120+', label: 'Partner Companies' },
              { val: '₹24 LPA', label: 'Highest Package' },
              { val: '95%', label: 'Placement Rate' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-features">
        <h2>Everything You Need for<br /><span style={{ color: 'var(--primary)' }}>Campus Placements</span></h2>
        <div className="landing-feature-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div className="landing-feature-card" key={i}>
                <div className="landing-feature-icon" style={{ background: f.color, color: f.iconColor }}>
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px 24px', borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)', fontSize: '0.825rem' }}>
        © 2026 CPMA — PSG Institute of Technology and Applied Research. All rights reserved.
      </footer>
    </div>
  );
}
