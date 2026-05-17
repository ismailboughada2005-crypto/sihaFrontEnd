

'use client';

import Logo from '../images/logo-siha.jpeg'
import Link from 'next/link';
import Image from "next/image";

const Navbar = ({ userProfile, onTabChange }) => {
  return (
    <header className="h-24 bg-card-bg/80 backdrop-blur-xl border-b border-card-border sticky top-0 z-50 flex items-center justify-between px-8 transition-colors duration-500">
      <div className="flex items-center gap-6">
        <Link href="/" className="tracking-tight text-primary outline-none transition-transform uppercase">
          <Image src={Logo} alt="siha clinic" className='h-[5rem] w-[12rem] ml-5 object-cover'/>
        </Link>
      </div>

      <div className="flex items-center gap-4">
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
