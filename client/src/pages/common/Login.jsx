import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, GraduationCap, Building2, Users, TrendingUp } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

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

          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your placement portal account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Password
                <a href="#" style={{ fontSize: '0.8rem', fontWeight: 400 }}>Forgot password?</a>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)',
                  }}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create account</Link>
          </div>

          <div style={{ marginTop: 32, padding: '16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <strong style={{ color: 'var(--text-secondary)' }}>Demo Accounts:</strong><br />
            Admin: admin@psgitar.edu<br />
            Student: student1@psgitar.edu<br />
            Recruiter: recruiter@tcs.com<br />
            Password: password123
          </div>
        </div>
      </div>

      <div className="auth-brand">
        <div className="auth-brand-content">
          <h1>
            Your Gateway to<br />
            <span>Campus Placements</span>
          </h1>
          <p>
            PSG Institute of Technology and Applied Research's comprehensive placement management system.
            Track applications, manage drives, and connect with top recruiters.
          </p>
          <div className="auth-brand-stats">
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">500+</div>
              <div className="auth-brand-stat-label">Students Placed</div>
            </div>
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">120+</div>
              <div className="auth-brand-stat-label">Companies</div>
            </div>
            <div className="auth-brand-stat">
              <div className="auth-brand-stat-value">₹24L</div>
              <div className="auth-brand-stat-label">Highest CTC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
