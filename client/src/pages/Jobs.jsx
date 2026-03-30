import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/apply/${jobId}`);
      alert('Application sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply.');
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.role === 'student' ? 'Eligible Jobs' : 'Your Job Postings'}
          </h1>
          {user.role === 'student' && <p className="text-gray-500">Jobs matched to your profile CGPA/Backlogs.</p>}
        </div>
        
        {user.role === 'recruiter' && (
          <Link to="/jobs/post" className="bg-indigo-600 text-white px-4 py-2 rounded shadow shrink-0 font-medium">
            + Post New Job
          </Link>
        )}
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by job title or company..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-md px-4 py-2 border rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 border border-dashed rounded-lg">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map(job => (
            <div key={job._id} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 truncate" title={job.title}>{job.title}</h3>
                <h4 className="text-md font-semibold text-indigo-600 mb-2 truncate">{job.company}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3" title={job.description}>{job.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">📍 {job.location || 'Remote'}</span>
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">💰 {job.salary || 'Unspecified'}</span>
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded font-medium">Req CGPA: {job.eligibilityCriteria?.minCGPA || 0}</span>
                </div>
              </div>
              
              {user.role === 'student' && (
                <button onClick={() => handleApply(job._id)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors">
                  One-Click Apply
                </button>
              )}
              {user.role === 'recruiter' && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  <Link to="/applications" className="text-indigo-600 font-medium hover:underline">View Applicants</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
