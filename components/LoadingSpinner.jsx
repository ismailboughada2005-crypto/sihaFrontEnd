'use client';

import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center pt-32 animate-in fade-in duration-500">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Records</p>
  </div>
);

export default LoadingSpinner;
