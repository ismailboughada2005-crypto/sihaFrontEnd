'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mb-8"
      >
        <Activity className="w-12 h-12" />
      </motion.div>
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-black text-on-surface tracking-tight">Syncing Terminal</h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse">Fetching Real-time Intelligence</p>
      </div>
      
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              delay: i * 0.2 
            }}
            className="w-2 h-2 bg-primary rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
