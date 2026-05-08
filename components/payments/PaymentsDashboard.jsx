'use client';

import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const StatCard = ({ label, value, sub, color, icon }) => (
  <div
    className="bg-white rounded-2xl p-6 shadow-sm border-t-4 min-w-[220px] flex-1"
    style={{ borderTopColor: color }}
  >
    <div className="text-3xl mb-2">{icon}</div>

    <div className="text-sm text-slate-500 mb-1">
      {label}
    </div>

    <div className="text-2xl font-bold text-slate-900">
      {value}
    </div>

    {sub && (
      <div className="text-xs text-slate-400 mt-1">
        {sub}
      </div>
    )}
  </div>
);

const Bar = ({ label, value, max, color }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1 text-sm">
      <span className="text-slate-700">{label}</span>

      <span className="font-semibold text-slate-900">
        {Number(value).toLocaleString()} MAD
      </span>
    </div>

    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${Math.min(
            (value / (max || 1)) * 100,
            100
          )}%`,
          background: color,
        }}
      />
    </div>
  </div>
);

export default function PaymentsDashboard() {
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [methods, setMethods] = useState([]);

  const [loading, setLoading] = useState(true);

  const year = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      api.reports.dashboard(),
      api.reports.monthlyRevenue(year),
      api.reports.paymentMethods(),
    ])
      .then(([dash, mon, meth]) => {
        setStats(dash);
        setMonthly(Array.isArray(mon) ? mon : []);
        setMethods(Array.isArray(meth) ? meth : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400 text-lg">
        Loading dashboard...
      </div>
    );
  }

  const maxMonthly = Math.max(
    ...monthly.map((m) => m.revenue || 0),
    1
  );

  const METHOD_COLORS = {
    cash: '#10b981',
    credit_card: '#6366f1',
    bank_transfer: '#f59e0b',
    mobile_payment: '#ec4899',
  };

  const METHOD_LABELS = {
    cash: 'Cash',
    credit_card: 'Credit Card',
    bank_transfer: 'Bank Transfer',
    mobile_payment: 'Mobile',
  };

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        <StatCard
          label="Daily Revenue"
          value={`${Number(
            stats?.daily_revenue || 0
          ).toLocaleString()} MAD`}
          color="#10b981"
          icon="📅"
        />

        <StatCard
          label="Monthly Revenue"
          value={`${Number(
            stats?.monthly_revenue || 0
          ).toLocaleString()} MAD`}
          color="#6366f1"
          icon="📆"
        />

        <StatCard
          label="Total Revenue"
          value={`${Number(
            stats?.total_revenue || 0
          ).toLocaleString()} MAD`}
          color="#3b82f6"
          icon="💰"
        />

        <StatCard
          label="Pending Invoices"
          value={stats?.pending_invoices || 0}
          sub={`${Number(
            stats?.pending_amount || 0
          ).toLocaleString()} MAD pending`}
          color="#f59e0b"
          icon="⏳"
        />

        <StatCard
          label="Total Refunded"
          value={`${Number(
            stats?.total_refunded || 0
          ).toLocaleString()} MAD`}
          color="#ef4444"
          icon="↩️"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* MONTHLY REVENUE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Monthly Revenue — {year}
            </h3>

            <div className="text-sm text-slate-400">
              Analytics
            </div>
          </div>

          <div className="flex items-end gap-2 h-[220px]">
            {monthly.map((m) => {
              const pct = Math.max(
                (m.revenue / maxMonthly) * 100,
                3
              );

              return (
                <div
                  key={m.month_num}
                  className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
                >
                  <div
                    title={`${m.revenue} MAD`}
                    className="w-full rounded-t-md transition-all duration-700 hover:opacity-80"
                    style={{
                      height: `${pct}%`,
                      background:
                        'linear-gradient(180deg,#6366f1,#818cf8)',
                      minHeight: '6px',
                    }}
                  />

                  <span className="text-[10px] text-slate-400">
                    {m.month.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Revenue by Payment Method
            </h3>

            <div className="text-sm text-slate-400">
              Payments
            </div>
          </div>

          {methods.length === 0 ? (
            <p className="text-sm text-slate-400">
              No payment data yet.
            </p>
          ) : (
            methods.map((m) => (
              <Bar
                key={m.payment_method}
                label={
                  METHOD_LABELS[m.payment_method] ||
                  m.payment_method
                }
                value={m.total}
                max={Math.max(...methods.map((x) => x.total))}
                color={
                  METHOD_COLORS[m.payment_method] ||
                  '#6366f1'
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}