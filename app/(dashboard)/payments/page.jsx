'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  Undo2, 
  ShieldCheck 
} from 'lucide-react';

import PaymentsDashboard from '../../../components/payments/PaymentsDashboard';
import InvoiceList from '../../../components/payments/InvoiceList';
import PaymentList from '../../../components/payments/PaymentList';;

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'payments', label: 'Payments', icon: CreditCard },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <PaymentsDashboard />;
      case 'invoices': return <InvoiceList />;
      case 'payments': return <PaymentList />;
      case 'insurance': return <InsuranceList />;
      case 'refunds': return <RefundList />;
      default: return <PaymentsDashboard />;
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-8">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Financial Module</h2>
          <p className="text-sm font-medium text-on-surface-variant uppercase tracking-widest text-[10px]">Revenue & Billing Control Center</p>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="flex bg-card-bg dark:bg-slate-800/50 p-1 rounded-2xl w-fit border border-slate-200/50">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive 
                ? 'bg-card-bg text-indigo-600 shadow-sm border border-card-border' 
                : 'text-on-surface-variant hover:text-on-surface-variant'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
