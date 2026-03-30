import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', company: '', description: '', location: '', salary: '', deadline: '',
    minCGPA: 0, maxBacklogs: 0, requiredSkills: '', departments: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        deadline: formData.deadline,
        eligibilityCriteria: {
          minCGPA: Number(formData.minCGPA),
          maxBacklogs: Number(formData.maxBacklogs),
          requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
          departments: formData.departments.split(',').map(d => d.trim()).filter(Boolean),
        }
      };
      await api.post('/jobs', payload);
      alert('Job posted successfully!');
      navigate('/jobs');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Job Posting</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input required type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary Package</label>
            <input type="text" name="salary" value={formData.salary} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Eligibility Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum CGPA (0-10)</label>
              <input type="number" step="0.1" name="minCGPA" value={formData.minCGPA} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Active Backlogs</label>
              <input type="number" name="maxBacklogs" value={formData.maxBacklogs} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Eligible Departments (comma separated, e.g. CSE, IT)</label>
            <input type="text" name="departments" placeholder="CSE, IT, ECE" value={formData.departments} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
             <input type="text" name="requiredSkills" placeholder="React, Node.js, Python" value={formData.requiredSkills} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
          <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="mt-1 inline-block border border-gray-300 rounded-md p-2" />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-md transition-colors">
          Publish Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
