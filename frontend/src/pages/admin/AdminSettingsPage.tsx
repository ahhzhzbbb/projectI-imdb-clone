import React from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';

/**
 * Admin Settings Page
 */
export const AdminSettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage system settings</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Application Name
            </label>
            <input
              type="text"
              defaultValue="IMDB Clone"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Application Description
            </label>
            <textarea
              defaultValue="A clone of IMDB website featuring movies and TV series"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded h-24 focus:outline-none focus:border-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-semibold">
              Enable User Registrations
            </label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-semibold">
              Enable Reviews
            </label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-gray-300 font-semibold">
              Enable Ratings
            </label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">Danger Zone</h3>
            <Button variant="danger">Clear All Cache</Button>
          </div>

          <div className="flex gap-3">
            <Button variant="primary">Save Settings</Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
