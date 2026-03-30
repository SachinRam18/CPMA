import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const fillDemo = (role) => {
    setEmail(`demo_${role}@example.com`);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Sign In</h2>
        
        {/* Demo Quick-fill */}
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg flex flex-col gap-2">
          <p className="text-xs text-indigo-800 font-bold uppercase mb-1">Quick Fill Demo Accounts:</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => fillDemo('student')} className="flex-1 bg-white text-indigo-700 text-xs border border-indigo-200 py-1 rounded hover:bg-indigo-100">Student</button>
            <button type="button" onClick={() => fillDemo('recruiter')} className="flex-1 bg-white text-indigo-700 text-xs border border-indigo-200 py-1 rounded hover:bg-indigo-100">Recruiter</button>
            <button type="button" onClick={() => fillDemo('admin')} className="flex-1 bg-white text-indigo-700 text-xs border border-indigo-200 py-1 rounded hover:bg-indigo-100">Admin</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <button type="submit" className="w-full py-2 px-4 shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors">
            Sign In
          </button>
          
          <div className="text-center mt-4">
            <Link to="/register" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
