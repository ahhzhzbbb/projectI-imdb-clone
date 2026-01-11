import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { Button } from '../../components/common/Button';
import { Save, RotateCcw, Trash2, Check } from 'lucide-react';

// Default settings
const DEFAULT_SETTINGS = {
  appName: 'IMDB Clone',
  appDescription: 'A clone of IMDB website featuring movies and TV series',
  enableRegistrations: true,
  enableReviews: true,
  enableRatings: true,
};

// Settings key for localStorage
const SETTINGS_KEY = 'app_settings';

// Helper to get settings from localStorage
export const getAppSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
};

/**
 * Admin Settings Page
 */
export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setSettings(getAppSettings());
  }, []);

  const handleChange = (key: keyof typeof DEFAULT_SETTINGS, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Dispatch event so other components can react
      window.dispatchEvent(new Event('settings-updated'));
    } catch (e) {
      console.error('Failed to save settings:', e);
      alert('Failed to save settings');
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setSaved(false);
  };

  const handleClearCache = () => {
    if (confirm('This will clear all cached data. Continue?')) {
      localStorage.clear();
      setSettings(DEFAULT_SETTINGS);
      alert('Cache cleared! Page will reload.');
      window.location.reload();
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-gray-400 mt-2">Manage system settings</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
        <h2 className="text-xl font-bold text-white mb-6">System Settings</h2>

        <div className="space-y-6">
          {/* Application Name */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Application Name
            </label>
            <input
              type="text"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Application Description */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Application Description
            </label>
            <textarea
              value={settings.appDescription}
              onChange={(e) => handleChange('appDescription', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded h-24 focus:outline-none focus:border-yellow-500 resize-none"
            />
          </div>

          {/* Toggle: Enable User Registrations */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-gray-300 font-semibold">Enable User Registrations</label>
              <p className="text-gray-500 text-sm">Allow new users to sign up</p>
            </div>
            <button
              onClick={() => handleChange('enableRegistrations', !settings.enableRegistrations)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enableRegistrations ? 'bg-yellow-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableRegistrations ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Toggle: Enable Reviews */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-gray-300 font-semibold">Enable Reviews</label>
              <p className="text-gray-500 text-sm">Show review section on movie pages</p>
            </div>
            <button
              onClick={() => handleChange('enableReviews', !settings.enableReviews)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enableReviews ? 'bg-yellow-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableReviews ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Toggle: Enable Ratings */}
          <div className="flex items-center justify-between py-2">
            <div>
              <label className="text-gray-300 font-semibold">Enable Ratings</label>
              <p className="text-gray-500 text-sm">Show rating section on episode pages</p>
            </div>
            <button
              onClick={() => handleChange('enableRatings', !settings.enableRatings)}
              className={`relative w-12 h-6 rounded-full transition-colors ${settings.enableRatings ? 'bg-yellow-500' : 'bg-gray-600'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableRatings ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
            <Button variant="danger" onClick={handleClearCache}>
              <Trash2 size={16} className="mr-2" />
              Clear All Cache
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Button variant="primary" onClick={handleSave}>
              {saved ? <Check size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw size={16} className="mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
