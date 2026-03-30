import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleSelect = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded">{error}</div>}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => handleRoleSelect('student')}
                className={`p-4 border rounded-lg text-center transition-all ${formData.role === 'student' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}>
                <div className="font-bold text-gray-800">Student</div>
                <div className="text-xs text-gray-500 mt-1">Looking for jobs</div>
              </button>
              <button type="button" onClick={() => handleRoleSelect('recruiter')}
                className={`p-4 border rounded-lg text-center transition-all ${formData.role === 'recruiter' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300'}`}>
                <div className="font-bold text-gray-800">Recruiter</div>
                <div className="text-xs text-gray-500 mt-1">Hiring talent</div>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <button type="submit" className="w-full py-2 px-4 shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition-colors">
            Register
          </button>
          
          <div className="text-center mt-4 text-sm font-medium text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
