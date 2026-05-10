import React from 'react';

const Profile = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-display dark:text-white">Profile</h1>
    <div className="card p-8 text-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-3xl mx-auto">
        AJ
      </div>
      <div>
        <h2 className="text-xl font-bold dark:text-white">Alex Johnson</h2>
        <p className="text-slate-500">alex.johnson@example.com</p>
      </div>
      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-left">
          <p className="text-xs text-slate-500 uppercase font-bold">Account Status</p>
          <p className="font-medium dark:text-white">Verified</p>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-left">
          <p className="text-xs text-slate-500 uppercase font-bold">Member Since</p>
          <p className="font-medium dark:text-white">May 2023</p>
        </div>
      </div>
    </div>
  </div>
);

export default Profile;
