import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

const Applications = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recruiter specific
  const [recruiterJobs, setRecruiterJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');

  useEffect(() => {
    if (user.role === 'student') fetchStudentApplications();
    else if (user.role === 'recruiter') fetchRecruiterJobsAndApps();
  }, [user]);

  const fetchStudentApplications = async () => {
    try {
      const res = await api.get('/applications');
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchRecruiterJobsAndApps = async () => {
    try {
      const jobsRes = await api.get('/jobs');
      setRecruiterJobs(jobsRes.data);
      if (jobsRes.data.length > 0) {
        setSelectedJob(jobsRes.data[0]._id);
        fetchJobApplications(jobsRes.data[0]._id);
      } else {
        setLoading(false);
      }
    } catch (err) { console.error(err); setLoading(false); }
  };

  const fetchJobApplications = async (jobId) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setData(res.data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (user.role === 'recruiter' && selectedJob) fetchJobApplications(selectedJob);
  }, [selectedJob]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status });
      setData(data.map(app => app._id === appId ? { ...app, status } : app));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to edit status');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {user.role === 'student' ? 'My Applications' : 'Applicant Tracking'}
      </h1>

      {user.role === 'recruiter' && recruiterJobs.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Job Posting to filter applicants:</label>
          <select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)} className="w-full md:w-1/2 p-2 border rounded">
            {recruiterJobs.map(job => (
              <option key={job._id} value={job._id}>{job.title} ({job.company}) - {new Date(job.createdAt).toLocaleDateString()}</option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? <p>Loading lists...</p> : 
        data.length === 0 ? <p className="text-gray-500 text-center py-6">No records found.</p> : (
          <div className="space-y-4">
            {data.map(app => (
              <div key={app._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-100 rounded-md hover:bg-gray-50">
                <div className="mb-4 md:mb-0">
                  {user.role === 'student' && app.job && (
                     <>
                       <h3 className="font-bold text-gray-800 text-lg">{app.job.title} <span className="text-sm font-normal text-gray-500">at {app.job.postedBy?.company || 'Company'}</span></h3>
                       <p className="text-xs text-gray-400">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                     </>
                  )}
                  {user.role === 'recruiter' && app.student && (
                     <>
                       <h3 className="font-bold text-gray-800 text-lg">{app.student.name}</h3>
                       <p className="text-sm text-gray-500">{app.student.email}</p>
                       <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()} for <span className="font-semibold">{app.job?.title}</span></p>
                     </>
                  )}
                </div>
                
                <div className="flex gap-4 items-center flex-wrap">
                  <StatusBadge status={app.status} />
                  
                  {user.role === 'recruiter' && (
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      className="text-sm border-gray-300 rounded p-1 bg-white cursor-pointer"
                    >
                      <option value="applied">Mark as Applied</option>
                      <option value="shortlisted">Mark as Shortlisted</option>
                      <option value="selected">Mark as Selected</option>
                      <option value="rejected">Mark as Rejected</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
