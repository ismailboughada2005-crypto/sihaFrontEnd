'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Bell, 
  Shield, 
  User, 
  Globe, 
  Moon, 
  Sun,
  Database,
  Mail,
  Smartphone,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [config, setConfig] = useState({
    language: 'English (United States)',
    timezone: 'UTC+01:00 (CET)'
  });
  const [notifications, setNotifications] = useState({
    appointments: true,
    payments: true,
    staff: false,
    security: true
  });

  const [toast, setToast] = useState(null);

  // Load settings on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true';
    const savedConfig = localStorage.getItem('systemConfig');
    
    if (savedDarkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('isDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('isDarkMode', 'false');
    }
  }, [isDarkMode]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Save to localStorage
    localStorage.setItem('systemConfig', JSON.stringify(config));
    
    setTimeout(() => {
      setIsSaving(false);
      showToast('General settings saved successfully');
    }, 800);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: User },
    { id: 'api', label: 'API & Integrations', icon: Database },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {toast && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest">{toast}</span>
        </motion.div>
      )}

      <div>
        <h2 className="text-3xl font-black text-on-surface tracking-tight">System Settings</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">Configure your workspace environment and security preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === section.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-on-surface">Appearance</h3>
                  <p className="text-xs font-bold text-slate-400">Customize how Horizon looks on your screen</p>
                </div>
                <button 
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    showToast(`${!isDarkMode ? 'Dark' : 'Light'} mode applied`);
                  }}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-transform"
                >
                  {isDarkMode ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-on-surface">Language & Region</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Language</label>
                    <select 
                      value={config.language}
                      onChange={(e) => setConfig({...config, language: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 text-on-surface"
                    >
                      <option>English (United States)</option>
                      <option>French (France)</option>
                      <option>Spanish (LatAm)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Zone</label>
                    <select 
                      value={config.timezone}
                      onChange={(e) => setConfig({...config, timezone: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 text-on-surface"
                    >
                      <option>UTC+00:00 (GMT)</option>
                      <option>UTC+01:00 (CET)</option>
                      <option>UTC-05:00 (EST)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`bg-slate-900 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-on-surface">Notification Preferences</h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'appointments', label: 'New Appointments', desc: 'Get notified when a patient schedules a visit' },
                  { id: 'payments', label: 'Payment Confirmations', desc: 'Alerts for successful or failed transactions' },
                  { id: 'staff', label: 'Staff Activity', desc: 'Logs for staff check-ins and updates' },
                  { id: 'security', label: 'Security Alerts', desc: 'Notifications for suspicious login attempts' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`h-1.5 w-1.5 rounded-full ${notifications[item.id] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">{item.label}</p>
                        <p className="text-[10px] font-bold text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                      className={`h-6 w-11 rounded-full transition-colors relative ${notifications[item.id] ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <motion.div 
                        animate={{ x: notifications[item.id] ? 20 : 4 }}
                        className="h-4 w-4 bg-white rounded-full absolute top-1 shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">Two-Factor (2FA)</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">Add an extra layer of security to your account by requiring a code from your phone.</p>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                    Enable now <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <h4 className="text-sm font-black text-on-surface uppercase tracking-tight">Email Verification</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-400 leading-relaxed">Ensure all administrators verify their email address before accessing the dashboard.</p>
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Sessions</h4>
                <div className="divide-y divide-slate-50">
                  {[
                    { device: 'MacBook Pro 16"', location: 'Paris, FR', status: 'Current Session' },
                    { device: 'iPhone 15 Pro', location: 'London, UK', status: '2 hours ago' }
                  ].map((session, i) => (
                    <div key={i} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-700">{session.device}</p>
                        <p className="text-[10px] font-bold text-slate-400">{session.location} • {session.status}</p>
                      </div>
                      <button className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Revoke</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'account' || activeTab === 'api') && (
            <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
              <Settings className="w-12 h-12 text-slate-200 mx-auto mb-4 animate-spin-slow" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-[0.25em]">Under Development</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
