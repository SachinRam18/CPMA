import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Notifications = () => {
  // Stubbed static file for notifications since we don't have a notifications route implemented fully on the backend yet
  // Using static placeholder for UI completeness
  const [notifications, setNotifications] = useState([
    { _id: 1, message: "Welcome to CPMS!", createdAt: new Date().toISOString() },
    { _id: 2, message: "Keep your profile up to date to see the best jobs.", createdAt: new Date(Date.now() - 86400000).toISOString() }
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button onClick={() => setNotifications([])} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Mark all as read</button>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">You're all caught up!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map(n => (
              <li key={n._id} className="p-4 hover:bg-gray-50 flex items-start gap-3">
                <div className="w-2 h-2 mt-2 bg-indigo-500 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="text-gray-800 font-medium">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
