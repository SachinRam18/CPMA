import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Building2, Shield } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const roles = [
    { id: 'student', label: 'Student', desc: 'Apply to jobs & track placements', icon: GraduationCap, color: 'var(--primary-bg)', iconColor: 'var(--primary)' },
    { id: 'recruiter', label: 'Recruiter', desc: 'Post jobs & hire candidates', icon: Building2, color: 'var(--success-bg)', iconColor: 'var(--success)' },
    { id: 'admin', label: 'Admin', desc: 'Manage placement operations', icon: Shield, color: 'var(--warning-bg)', iconColor: 'var(--warning)' },
  ];

  return (
    <div className="auth-layout">
      <div className="auth-panel">
        <div className="auth-form-container animate-fadeIn">
          <div className="auth-form-logo">
            <div className="sidebar-logo-icon" style={{ width: 42, height: 42, fontSize: '1.1rem' }}>CP</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>CPMA</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Placement Management</div>
            </div>
          </div>

          <h1 className="auth-form-title">Create an account</h1>
          <p className="auth-form-subtitle">Join the PSG iTAR placement portal</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select your role</label>
              <div className="role-selector">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.id} className={`role-option ${role === r.id ? 'selected' : ''}`} onClick={() => setRole(r.id)}>
                      <div className="role-option-icon" style={{ background: r.color, color: r.iconColor }}>
                        <Icon size={20} />
                      </div>
                      <div className="role-option-label">{r.label}</div>
                      <div className="role-option-desc">{r.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <div className="form-hint">Must be at least 6 characters</div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      <div className="auth-brand">
        <div className="auth-brand-content">
          <h1>
            Start Your<br />
            <span>Placement Journey</span>
          </h1>
          <p>
            Connect with top companies, track your progress, and land your dream job through PSG iTAR's placement cell.
          </p>
          <div className="auth-brand-stats">
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">95%</div>
              <div className="auth-brand-stat-label">Placement Rate</div>
            </div>
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">₹8.5L</div>
              <div className="auth-brand-stat-label">Average CTC</div>
            </div>
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">50+</div>
              <div className="auth-brand-stat-label">Active Drives</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
