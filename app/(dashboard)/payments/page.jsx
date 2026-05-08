'use client';
import React, { useState } from 'react';
import PaymentsDashboard from '../../../components/payments/PaymentsDashboard';
import InvoiceList from '../../../components/payments/InvoiceList';
import PaymentList from '../../../components/payments/PaymentList';
import RefundList from '../../../components/payments/RefundList';
import InsuranceList from '../../../components/payments/InsuranceList';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'invoices',  label: 'Invoices'  },
  { id: 'payments',  label: 'Payments'  },
  { id: 'refunds',   label: 'Refunds'   },
  { id: 'insurance', label: 'Insurance' },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          Payments Module
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>
          Manage invoices, payments, refunds, and insurance claims
        </p>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex', gap: '4px', background: '#fff',
        borderRadius: '12px', padding: '4px', marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: 'fit-content'
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontSize: '14px', fontWeight: '500',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? '#6366f1' : 'transparent',
              color: activeTab === tab.id ? '#fff' : '#64748b',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <PaymentsDashboard />}
      {activeTab === 'invoices'  && <InvoiceList />}
      {activeTab === 'payments'  && <PaymentList />}
      {activeTab === 'refunds'   && <RefundList />}
      {activeTab === 'insurance' && <InsuranceList />}
    </div>
  );
}
