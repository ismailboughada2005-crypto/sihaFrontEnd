'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Shield, 
  Bell, 
  Lock, 
  Save,
  LogOut,
  ChevronRight,
  Globe,
  Briefcase
} from 'lucide-react';

const ProfilePage = ({ userProfile, setUserProfile }) => {
  const [activeSubTab, setActiveSubTab] = useState('general');
  const [formData, setFormData] = useState({ ...userProfile });

  const handleSave = () => {
    setUserProfile({ ...formData });
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">My Profile</h2>
        <p className="text-sm font-medium text-slate-500">Manage your administrative identity and security preferences</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
        {/* Left Column: Profile Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-slate-900" />
            <div className="relative pt-12 pb-6">
              <div className="relative inline-block group mb-6">
                <div className="h-32 w-32 bg-white rounded-full p-1 shadow-2xl relative z-10">
                  <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center text-3xl font-black text-slate-300 ring-4 ring-white overflow-hidden">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt={userProfile.name} className="h-full w-full object-cover" />
                    ) : (
                      userProfile.name.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg border-4 border-white hover:scale-110 transition-transform active:scale-95 z-20">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-2xl font-black text-on-surface">{userProfile.name}</h3>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em] mt-1">{userProfile.role}</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-4 text-slate-500">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-bold">{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs font-bold">{userProfile.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Professional summary</h4>
            <p className="text-sm font-medium leading-relaxed text-slate-300 mb-8">
              {userProfile.bio}
            </p>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Member Since</span>
              <span className="text-white">{userProfile.joinDate}</span>
            </div>
          </div>

          <button className="w-full py-4 bg-white border border-rose-100 rounded-2xl text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-colors flex items-center justify-center gap-3">
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-2 border-b border-slate-50 bg-slate-50/50">
            <div className="flex p-1">
              {[
                { id: 'general', label: 'General', icon: User },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Alerts', icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeSubTab === tab.id 
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-10 flex-1">
            {activeSubTab === 'general' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Specialization</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office Location</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio Description</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 outline-none h-32 resize-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-12 border-t border-slate-50">
                   <h4 className="text-sm font-black text-on-surface mb-6">Language & Region</h4>
                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group cursor-pointer hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm"><Globe className="w-5 h-5 text-primary" /></div>
                        <div>
                          <p className="text-xs font-black text-on-surface">Standard Language</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5">English (United States)</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
                   </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'security' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-8 bg-slate-900 rounded-[2rem] text-white">
                    <div className="flex items-center gap-6">
                      <Lock className="w-10 h-10 text-primary" />
                      <div>
                        <h4 className="text-lg font-black tracking-tight">Two-Factor Authentication</h4>
                        <p className="text-xs text-slate-400 font-medium">Add an extra layer of security to your clinical account.</p>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">Enable Now</button>
                  </div>

                  <div className="p-8 bg-white border border-slate-100 rounded-[2rem] space-y-6">
                     <h4 className="text-sm font-black text-on-surface mb-6">Password Reset</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <input type="password" placeholder="Current Secret" className="bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none" />
                        <input type="password" placeholder="New Secret" className="bg-slate-50 border-none rounded-xl py-3 px-4 text-xs font-bold outline-none" />
                     </div>
                     <button className="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">Update Credentials</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSubTab === 'notifications' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {[
                  { title: 'Emergency Alerts', desc: 'Critical patient updates and emergency room calls', active: true },
                  { title: 'Appointment Changes', desc: 'New bookings or scheduling modifications', active: true },
                  { title: 'Staff Messages', desc: 'Direct communications from admin and MDs', active: false },
                  { title: 'System Updates', desc: 'Platform maintenance and feature releases', active: false },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all group">
                    <div>
                      <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{notif.title}</p>
                      <p className="text-[11px] font-bold text-slate-400 mt-1">{notif.desc}</p>
                    </div>
                    <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${notif.active ? 'bg-primary' : 'bg-slate-200'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${notif.active ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="p-8 border-t border-slate-50 bg-slate-50/20 flex justify-end">
             <button 
              onClick={handleSave}
              className="px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-3 active:scale-95"
             >
               <Save className="w-4 h-4" /> Save Local Snapshot
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
