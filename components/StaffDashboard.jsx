'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BadgeCheck, 
  Clock, 
  ClipboardList, 
  Plus, 
  TrendingUp,
  ChevronRight,
  ClipboardCheck,
  Building,
  AlertCircle
} from 'lucide-react';
import KPICard from './KPICard';

const StaffDashboard = ({ patients }) => {
  const checkins = (patients || []).slice(0, 4).map(p => ({
    p: (p.prenom || '') + ' ' + (p.nom || ''),
    doc: 'Dr. Aris',
    status: p.status,
    color: p.status === 'Active' ? 'blue' : p.status === 'Waiting' ? 'amber' : 'emerald',
    room: String(p.id).includes('-') ? String(p.id).split('-')[1] : `Room ${p.id}`
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Staff Hub</h2>
          <p className="text-sm font-medium text-slate-500">Coordinating patient flow & facility logistics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
            Flow Logs
          </button>
          <button className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]">
            Check-in Patient
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Check-ins" value="142" icon={Home} color="bg-blue-600" />
        <KPICard title="Occupancy" value="18/24" icon={BadgeCheck} color="bg-emerald-600" />
        <KPICard title="Avg Wait" value="22m" trend="up" trendValue="18" icon={Clock} color="bg-rose-600" />
        <KPICard title="Pending Billing" value="9" icon={ClipboardList} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">Active Rooming</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live patient coordination</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Main Wing</button>
              <button className="px-3 py-1.5 rounded-lg border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-slate-50">Diagnostics</button>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              <span>Patient</span>
              <span>Provider</span>
              <span className="text-center">Status</span>
              <span className="text-right">Room</span>
            </div>
            {checkins.map((row, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-4 gap-4 px-6 py-5 hover:bg-slate-50/50 transition-colors border-b border-slate-50 items-center group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center">
                     <ClipboardCheck className="w-4 h-4 text-slate-400" />
                   </div>
                   <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{row.p}</span>
                </div>
                <span className="text-xs font-bold text-slate-500">{row.doc}</span>
                <div className="flex justify-center">
                   <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                    row.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-100' :
                    row.color === 'amber' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                    row.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                    'bg-indigo-50 text-indigo-600 ring-indigo-100'
                  }`}>
                    {row.status}
                  </span>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <span className="text-xs font-black text-slate-400">{row.room}</span>
                  <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden h-full">
             <div className="flex items-center justify-between mb-8 relative z-10">
               <div>
                 <h3 className="text-lg font-black tracking-tight">Facility Health</h3>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Real-time capacity</p>
               </div>
               <Building className="w-10 h-10 text-white/10" />
             </div>

             <div className="space-y-6 relative z-10">
               {[
                 { label: 'Patient Lounges', val: 68 },
                 { label: 'Lab Queues', val: 42 },
                 { label: 'Parking Alpha', val: 95 },
               ].map((item, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-white/50">
                     <span>{item.label}</span>
                     <span className={item.val > 90 ? 'text-rose-400' : 'text-white'}>{item.val}%</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${item.val}%` }}
                       className={`h-full rounded-full ${item.val > 90 ? 'bg-rose-500' : 'bg-primary/20'}`} 
                     />
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-12 p-5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-[10px] font-bold text-white/70 leading-relaxed uppercase tracking-tighter">
                  Wait times in General Diagnostics are trending high. Consider diverting overflow.
                </p>
             </div>
          </div>
          
          <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group bg-white shadow-sm hover:shadow-md">
            <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            Quick Patient Check-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
