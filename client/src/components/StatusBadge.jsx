import React from 'react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'applied':
      return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-yellow-200">Applied</span>;
    case 'shortlisted':
      return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200">Shortlisted</span>;
    case 'selected':
      return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">Selected</span>;
    case 'rejected':
      return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-red-200">Rejected</span>;
    default:
      return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{status}</span>;
  }
};

export default StatusBadge;
