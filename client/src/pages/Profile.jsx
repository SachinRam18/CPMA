import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState({ cgpa: '', skills: '', department: '', backlogs: 0, resume: '', graduationYear: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/profile')
      .then(res => {
         const data = res.data;
         setProfile({
           ...data, 
           cgpa: data.cgpa || '',
           skills: data.skills ? data.skills.join(', ') : '',
           department: data.department || '',
           backlogs: data.backlogs || 0,
           resume: data.resume || '',
           graduationYear: data.graduationYear || ''
         });
         setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', {
        ...profile,
        cgpa: Number(profile.cgpa),
        backlogs: Number(profile.backlogs),
        graduationYear: Number(profile.graduationYear)
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Student Profile</h1>
      
      {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm font-medium">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700">CGPA</label>
              <input type="number" step="0.1" name="cgpa" required value={profile.cgpa} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Active Backlogs</label>
              <input type="number" name="backlogs" value={profile.backlogs} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" name="department" placeholder="e.g. CSE" required value={profile.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input type="number" name="graduationYear" value={profile.graduationYear} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
           <input type="text" name="skills" placeholder="React, Java, Python" required value={profile.skills} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700">Resume Link (GDrive/Dropbox)</label>
           <input type="url" name="resume" placeholder="https://..." value={profile.resume} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>

        <button type="submit" className="w-full mt-6 bg-indigo-600 text-white font-medium py-2 rounded transition hover:bg-indigo-700">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
