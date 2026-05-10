import React from 'react';

const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold font-display dark:text-white">Settings</h1>
    <div className="card divide-y divide-slate-200 dark:divide-slate-800">
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="font-bold dark:text-white">Email Notifications</p>
          <p className="text-sm text-slate-500">Receive updates about your loan status.</p>
        </div>
        <div className="w-12 h-6 bg-primary-600 rounded-full relative">
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="p-6 flex items-center justify-between">
        <div>
          <p className="font-bold dark:text-white">Two-Factor Authentication</p>
          <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
        </div>
        <button className="text-sm font-bold text-primary-600">Enable</button>
      </div>
    </div>
  </div>
);

export default Settings;
