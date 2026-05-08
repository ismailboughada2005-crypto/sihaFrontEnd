'use client';

import React from 'react';
import { 
  Monitor, 
  Stethoscope, 
  ClipboardList, 
  Calendar, 
  Users, 
  LineChart, 
  Settings, 
  LogOut, 
  User, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import Link from 'next/link';

const SidebarItem = ({ id, label, icon: Icon, badge, active }) => (
  <Link 
    href={id === 'admin' || id === 'doctor' || id === 'staff' ? '/' : `/${id}`}
    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group font-bold text-sm w-full ${
      active 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-slate-400 hover:bg-item-hover hover:text-primary transition-colors'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-300 group-hover:text-primary'}`} />
    <span>{label}</span>
    {badge && (
      <span className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-primary/5 text-primary'
      }`}>
        {badge}
      </span>
    )}
  </Link>
);

const Sidebar = ({ activeTab, onTabChange, patientCount, doctorCount, staffCount, appointmentCount, userRole, onLogout }) => {
  const dashItems = [
    { id: 'admin', label: 'Admin Terminal', icon: Monitor, roles: ['admin'] },
    { id: 'doctor', label: 'Doctor Suite', icon: Stethoscope, roles: ['doctor'] },
    { id: 'staff', label: 'Staff Hub', icon: ClipboardList, roles: ['staff'] },
  ];

  const mainItems = [
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'staff'] },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['admin'] },
    { id: 'staff-management', label: 'Staff', icon: Users, roles: ['admin'] },
    { id: 'admins', label: 'Admins', icon: ShieldCheck, roles: ['admin'] },
    { id: 'payments', label: 'Payments', icon: CreditCard, roles: ['admin', 'staff'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'staff'] },
    { id: 'analytics', label: 'Analytics', icon: LineChart, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'doctor', 'staff'] },
  ];

  return (
    <aside className="w-72 bg-card-bg border-r border-card-border hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)] transition-colors duration-500">
      <div className="p-8 pb-4 flex-1 flex flex-col overflow-y-auto">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 ml-2">Operational Views</h3>
        <nav className="flex flex-col gap-1.5 mb-8">
          {dashItems.filter(item => item.roles.includes(userRole)).map(item => (
            <SidebarItem key={item.id} {...item} active={activeTab === item.id || (activeTab === '' && (item.id === 'admin' || item.id === 'doctor' || item.id === 'staff'))} />
          ))}
        </nav>

        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 ml-2">Center Management</h3>
        <nav className="flex flex-col gap-1.5">
          {mainItems.filter(item => item.roles.includes(userRole)).map(item => (
            <SidebarItem key={item.id} {...item} active={activeTab === item.id} />
          ))}
        </nav>


      </div>

      <div className="p-8 border-t border-card-border">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 rounded-xl transition-all group font-medium text-sm"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
