'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const KPICard = ({ title, value, trend, trendValue, icon: Icon, color }) => (
  <div className="bg-card-bg p-6 rounded-[2rem] border border-card-border shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${color} text-white group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
          trend === 'up' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
        }`}>
          {trend === 'up' ? <ArrowUpRight className="w-3" /> : <ArrowDownRight className="w-3" />}
          {trendValue}%
        </div>
      )}
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
    <h3 className="text-2xl font-black text-on-surface transition-colors duration-500">{value}</h3>
  </div>
);

export default KPICard;
