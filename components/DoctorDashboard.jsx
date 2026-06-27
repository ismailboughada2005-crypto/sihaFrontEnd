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
import api from '../services/api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = React.useState([]);
  const [stats, setStats] = React.useState({ total: 0, today: 0, confirmed: 0, pending: 0 });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await api.doctorAppointments.getAll({ date_filter: 'today' });
        setAppointments(data.appointments.data || []);
        setStats(data.stats);
      } catch (err) {
        console.error('Dashboard data load failed', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <div className="flex flex-col items-center justify-center pt-32 animate-in fade-in duration-500">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Records</p>
    </div>
;

  const schedule = appointments.map(app => ({
    name: (app.patient?.prenom || '') + ' ' + (app.patient?.nom || ''),
    status: app.status,
    time: app.appointment_time,
    procedure: 'Consultation',
    room: 'Room ' + (Math.floor(Math.random() * 5) + 1)
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Doctor's Suite</h2>
          <p className="text-sm font-medium text-on-surface-variant">Managing clinical rounds & patient care</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Total Appointments" value={stats.total} icon={Calendar} color="bg-indigo-600" />
        <KPICard title="Today's Rounds" value={stats.today} icon={Clock} color="bg-orange-500" />
        <KPICard title="Confirmed" value={stats.confirmed} icon={BadgeCheck} color="bg-teal-500" />
        <KPICard title="Pending" value={stats.pending} icon={AlertTriangle} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-[118rem]">
        <div className="xl:col-span-8 bg-card-bg p-8 rounded-[2.5rem] border border-card-border shadow-sm">
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
            {schedule.length > 0 ? schedule.map((patient, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-5 bg-surface border border-card-border rounded-2xl hover:border-primary/20 hover:bg-card-bg transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm border ${
                    patient.status === 'confirmed' ? 'bg-primary text-white border-primary/20' :
                    patient.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-card-bg text-slate-400 border-slate-200'
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
                    patient.status === 'confirmed' ? 'bg-indigo-50 text-indigo-600 ring-indigo-100' :
                    patient.status === 'pending' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                    patient.status === 'completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                    'bg-surface text-slate-400 ring-card-border'
                  }`}>
                    {patient.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-on-surface transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="py-12 text-center text-slate-400 font-bold text-sm">
                No appointments for today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
