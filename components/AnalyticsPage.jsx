'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Users, 
  Activity, 
  Calendar,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';

const AnalyticsPage = ({ patients, doctors, appointments }) => {
  // Mock data for charts
  const patientTrafficData = [
    { name: 'Mon', patients: 24, appointments: 18 },
    { name: 'Tue', patients: 35, appointments: 25 },
    { name: 'Wed', patients: 28, appointments: 22 },
    { name: 'Thu', patients: 45, appointments: 38 },
    { name: 'Fri', patients: 32, appointments: 28 },
    { name: 'Sat', patients: 18, appointments: 12 },
    { name: 'Sun', patients: 12, appointments: 8 },
  ];

  const deptDistribution = [
    { name: 'Cardiology', value: 400 },
    { name: 'Neurology', value: 300 },
    { name: 'Pediatrics', value: 300 },
    { name: 'Dermatology', value: 200 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const stats = [
    { label: 'Avg Monthly Patients', value: '1,284', change: '+12.5%', isUp: true, icon: Users },
    { label: 'Booking Capacity', value: '82%', change: '-2.4%', isUp: false, icon: Calendar },
    { label: 'Revenue Growth', value: '$84.2k', change: '+8.1%', isUp: true, icon: TrendingUp },
    { label: 'Staff Efficiency', value: '94.8%', change: '+0.4%', isUp: true, icon: Activity },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header>
        <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Clinical Analytics</h2>
        <p className="text-sm font-medium text-slate-500">Performance metrics and patient demographic insights</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.isUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-black text-on-surface">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-on-surface tracking-tight">Patient Traffic</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Volume Overview</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Patients</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Bookings</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientTrafficData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                    fontSize: '12px',
                    fontWeight: '800'
                  }} 
                />
                <Area type="monotone" dataKey="patients" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorPatients)" />
                <Area type="monotone" dataKey="appointments" stroke="#10b981" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-black text-on-surface tracking-tight">Department Utilization</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Specialization Load Distribution</p>
          </div>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-8">
              {deptDistribution.map((dept, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <div>
                    <p className="text-xs font-black text-on-surface">{dept.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">{Math.round(dept.value / 1200 * 100)}% Load</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-black tracking-tight mb-6 leading-tight">Patient Satisfaction <br/><span className="text-primary">Record Highs.</span></h3>
            <p className="text-slate-400 font-medium mb-8 max-w-md">Our recent facility upgrades and personnel expansion have resulted in a 98.4% positive feedback rating across all departments.</p>
            <button className="px-8 py-4 bg-primary rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">Download PDF Report</button>
          </div>
          <div className="h-48 flex items-end gap-2 justify-end">
            {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 + 0.5, type: 'spring' }}
                className="w-8 bg-white/10 rounded-t-xl relative group"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
      </div>
    </div>
  );
};

export default AnalyticsPage;
