'use client';

import React, { useState, useEffect } from 'react';
import Logo from '../images/logo.png';
import Link from 'next/link';
import Image from "next/image";
import { Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const Navbar = ({ userProfile, onTabChange }) => {
  const { language, changeLanguage } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('isDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('isDarkMode', 'false');
    }
  };

  return (
    <header className="h-20 bg-card-bg/80 backdrop-blur-xl border-b border-card-border sticky top-0 z-50 flex items-center justify-between px-8 transition-colors duration-500">
      <div className="flex items-center gap-6">
        <Link href="/" className="tracking-tight text-primary outline-none transition-transform uppercase">
          <Image src={Logo} alt="siha clinic" className='h-[5rem] w-[5rem] ml-5 object-cover'/>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 bg-surface dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
          title={isDarkMode ? (language === 'en' ? 'Light Mode' : 'Mode Clair') : (language === 'en' ? 'Dark Mode' : 'Mode Sombre')}
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => changeLanguage(language === 'en' ? 'fr' : 'en')}
          className="flex items-center gap-2 px-3 py-2 bg-surface dark:bg-slate-800 border border-card-border dark:border-slate-700 rounded-xl text-[10px] font-black text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all uppercase tracking-wider"
          title={language === 'en' ? 'Switch to French' : 'Passer en Français'}
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>{language === 'en' ? 'EN' : 'FR'}</span>
        </button>

        <div 
          className="flex items-center gap-3 hover:bg-item-hover p-2 rounded-2xl transition-all border border-transparent hover:border-card-border group"
        >
          <div className="text-right hidden sm:block px-4 border-l border-card-border">
            <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors uppercase tracking-tight">{userProfile.name}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-0.5">{userProfile.role}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs ring-2 ring-card-border group-hover:ring-primary/20 transition-all">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
