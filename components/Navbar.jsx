'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Bell, MessageSquare } from 'lucide-react';

const Navbar = ({ userProfile, onTabChange }) => {
  return (
    <header className="h-20 bg-card-bg/80 backdrop-blur-xl border-b border-card-border sticky top-0 z-50 flex items-center justify-between px-8 transition-colors duration-500">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-black tracking-tight text-primary outline-none hover:scale-105 transition-transform">
          Horizon Clinic
        </Link>
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-surface border-card-border border rounded-2xl w-80 py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-on-surface" 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-8 w-px bg-card-border mx-2"></div>
        <Link 
          href="/profile"
          className="flex items-center gap-3 hover:bg-item-hover p-2 rounded-2xl transition-all border border-transparent hover:border-card-border group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{userProfile.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{userProfile.role}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden ring-2 ring-card-border group-hover:ring-primary/20 transition-all">
            <img 
              src={userProfile.avatar} 
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
