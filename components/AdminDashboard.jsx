'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  CheckCircle, 
  ChevronRight, 
  MoreHorizontal,
  Clock,
  Search,
  Edit2,
  Trash2,
  Stethoscope,
  ClipboardList,
  Calendar
} from 'lucide-react';
import KPICard from './KPICard';
import api from '../services/api';
import { X } from 'lucide-react';

const AdminDashboard = ({ patients, doctors, staff, appointments, setPatients, onTabChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record? This cannot be undone.')) {
      try {
        setLoading(true);
        await api.patients.delete(id);
        setPatients(prev => prev.filter(p => p.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete patient: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = () => {
    onTabChange('patients');
  };

  const filteredPatients = (patients || []).filter(p => 
    (p.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (p.prenom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    String(p.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Administrative Terminal</h2>
          <p className="text-sm font-medium text-slate-500">Clinic-wide Performance & High-level Metrics</p>
        </div>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Total Patients" value={patients?.length || 0} icon={Users} color="bg-blue-600" />
        <KPICard title="Doctors" value={doctors?.length || 0} icon={Stethoscope} color="bg-indigo-600" />
        <KPICard title="Medical Staff" value={staff?.length || 0} icon={ClipboardList} color="bg-purple-600" />
        <KPICard title="Appointments" value={appointments?.length || 0} icon={Calendar} color="bg-emerald-600" />
      </div>

      <div className="w-[117rem] grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="w-full xl:col-span-8 bg-card-bg p-8 rounded-[2.5rem] border border-card-border shadow-sm transition-all duration-500">
          <div className="flex justify-between items-center mb-10 px-2">
            <div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">siha Admissions</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global monitoring</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter name..." 
                  className="bg-surface border border-card-border rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold tracking-tight w-48 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-on-surface transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Profile</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date of Birth</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dept. / Status</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {filteredPatients.map((patient, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={patient.id} 
                    className="group hover:bg-item-hover transition-colors"
                  >
                    <td className="px-4 py-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="h-10 w-10 bg-surface rounded-xl flex items-center justify-center font-bold text-xs text-slate-500 border border-card-border uppercase">
                          {patient.avatar || (patient.prenom?.[0] || '') + (patient.nom?.[0] || '')}
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{patient.prenom} {patient.nom}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <p className="text-xs font-bold text-slate-600">{patient.dob || 'N/A'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{patient.dob ? (new Date().getFullYear() - new Date(patient.dob).getFullYear()) + ' years old' : ''}</p>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-slate-600">{patient.email}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{patient.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex flex-col gap-2 italic">
                        <p className="text-[10px] font-black text-primary uppercase tracking-tighter">{patient.dept}</p>
                        <div className="flex">
                          <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ring-1 ${
                            patient.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-900/50' :
                            patient.status === 'Waiting' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-amber-100 dark:ring-amber-900/50' :
                            patient.status === 'Billing' ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 ring-sky-100 dark:ring-sky-900/50' :
                            'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 ring-slate-100 dark:ring-slate-700'
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={handleEdit}
                          className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-slate-50 rounded-lg" 
                          title="Edit Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(patient.id)}
                          disabled={loading}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-lg disabled:opacity-30" 
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={handleEdit}
                          className="p-2 text-slate-300 hover:text-primary transition-colors hover:bg-primary/5 rounded-lg border border-transparent hover:border-slate-100" 
                          title="View Details"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
