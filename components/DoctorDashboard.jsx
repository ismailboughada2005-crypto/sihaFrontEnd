'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Clock, 
  Calendar, 
  ChevronRight, 
  MoreHorizontal,
  User,
  AlertTriangle,
  BadgeCheck,
  Plus,
  ArrowRight,
  Star,
  ClipboardList
} from 'lucide-react';
import KPICard from './KPICard';

const DoctorDashboard = ({ patients }) => {
  const schedule = (patients || []).slice(0, 4).map(p => ({
    name: (p.prenom || '') + ' ' + (p.nom || ''),
    status: p.status === 'Active' ? 'In Progress' : p.status,
    time: p.time || '09:00 AM',
    procedure: 'Consultation',
    room: 'Room ' + (Math.floor(Math.random() * 500) + 100)
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Doctor's Suite</h2>
          <p className="text-sm font-medium text-slate-500">Managing clinical rounds & patient care</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
            Schedule
          </button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
            New Prescription
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="My Patients" value="28" icon={User} color="bg-indigo-600" subtext="Scheduled for today" />
        <KPICard title="Avg Wait Time" value="14m" trend="down" trendValue="4.2" icon={Clock} color="bg-orange-500" />
        <KPICard title="Critical Reviews" value="3" icon={AlertTriangle} color="bg-rose-500" />
        <KPICard title="Completed" value="12/28" icon={BadgeCheck} color="bg-teal-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">Today's Schedule</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time rounds</p>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-1">
              View Calendar <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {schedule.map((patient, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 hover:bg-white transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm border ${
                    patient.status === 'In Progress' ? 'bg-primary text-white border-primary/20' :
                    patient.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {patient.time.split(':')[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{patient.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.procedure} • {patient.room}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                    patient.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' :
                    patient.status === 'Waiting' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                    patient.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                    'bg-slate-50 text-slate-400 ring-slate-100'
                  }`}>
                    {patient.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-on-surface transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-on-surface mb-8 tracking-tight px-2">Clinical Shortcuts</h3>
          <div className="grid grid-cols-2 gap-4">
            {['Charts', 'Rx', 'Lab Orders', 'Referrals'].map((label, idx) => (
              <button key={idx} className="p-6 border border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-primary/20 transition-all group shadow-sm">
                <div className="h-10 w-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {idx === 0 ? <User className="w-5 h-5" /> : idx === 1 ? <Plus className="w-5 h-5" /> : idx === 2 ? <ClipboardList className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="text-xs font-black text-primary mb-2 flex items-center gap-2 uppercase tracking-widest">
              <Star className="w-4 h-4 fill-primary" /> Success Insight
            </h4>
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-bold italic">
              "Your documentation flow is up 12% this week. Keep up the high efficiency metrics!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
