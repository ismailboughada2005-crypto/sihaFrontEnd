'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const METHOD_ICONS = {
  cash: '💵',
  credit_card: '💳',
  bank_transfer: '🏦',
  mobile_payment: '📱',
};

const METHOD_LABELS = {
  cash: 'Cash',
  credit_card: 'Credit Card',
  bank_transfer: 'Bank Transfer',
  mobile_payment: 'Mobile',
};

const STATUS_STYLES = {
  paid: 'bg-green-50 text-green-600',
  pending: 'bg-yellow-50 text-yellow-600',
  failed: 'bg-red-50 text-red-600',
  refunded: 'bg-violet-50 text-violet-600',
};

const Badge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
      STATUS_STYLES[status] || 'bg-slate-100 text-slate-500'
    }`}
  >
    {status}
  </span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto max-h-[90vh]">
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="text-2xl text-slate-400 hover:text-slate-600"
        >
          ×
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  </div>
);

function ReceiptModal({ payment, onClose }) {
  const p = payment;

  const handlePrint = () => window.print();

  return (
    <Modal title="🧾 Payment Receipt" onClose={onClose}>
      <div className="font-serif">
        {/* HEADER */}
        <div className="text-center border-b-2 border-dashed border-slate-200 pb-5 mb-6">
          <h2 className="text-2xl font-bold text-indigo-500">
            🏥 Siha Clinic
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Official Payment Receipt
          </p>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm leading-7 mb-6">
          <div>
            <strong>Receipt #:</strong>{' '}
            PAY-{String(p.id).padStart(6, '0')}
          </div>

          <div>
            <strong>Date:</strong>{' '}
            {new Date(
              p.payment_date
            ).toLocaleDateString()}
          </div>

          <div>
            <strong>Patient:</strong>{' '}
            {p.patient
              ? `${p.patient.nom} ${p.patient.prenom}`
              : '—'}
          </div>

          <div>
            <strong>Invoice:</strong>{' '}
            {p.invoice?.invoice_number || '—'}
          </div>

          <div>
            <strong>Method:</strong>{' '}
            {METHOD_LABELS[p.payment_method] ||
              p.payment_method}
          </div>

          <div>
            <strong>Status:</strong> {p.status}
          </div>
        </div>

        {/* AMOUNT */}
        <div className="bg-green-50 rounded-2xl p-6 text-center mb-6">
          <div className="text-sm text-slate-500">
            Amount Paid
          </div>

          <div className="text-4xl font-bold text-green-600 mt-2">
            {Number(p.amount).toFixed(2)} DZD
          </div>
        </div>

        {/* SIGNATURES */}
        <div className="border-t border-dashed border-slate-200 pt-6 grid grid-cols-2 gap-10 mb-4">
          <div className="text-center text-xs text-slate-500">
            <div className="h-10 border-b border-slate-700 mb-2"></div>
            Cashier Signature
          </div>

          <div className="text-center text-xs text-slate-500">
            <div className="h-10 border-b border-slate-700 mb-2"></div>
            Patient Signature
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Thank you for your payment. Keep this receipt for
          your records.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          Close
        </button>

        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition"
        >
          🖨️ Print
        </button>
      </div>
    </Modal>
  );
}

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatus] = useState('');
  const [methodFilter, setMethod] = useState('');

  const [receipt, setReceipt] = useState(null);

  const load = useCallback(() => {
    setLoading(true);

    const params = new URLSearchParams();

    if (statusFilter)
      params.set('status', statusFilter);

    if (methodFilter)
      params.set('payment_method', methodFilter);

    const qs = params.toString()
      ? `?${params}`
      : '';

    api.payments
      .getAll(qs)
      .then((res) =>
        setPayments(res.data || res || [])
      )
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter, methodFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (
      !confirm(
        'Delete this payment? This will reverse the invoice balance.'
      )
    )
      return;

    try {
      await api.payments.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReceipt = async (payment) => {
    try {
      const data = await api.payments.receipt(
        payment.id
      );

      setReceipt(data);
    } catch {
      setReceipt(payment);
    }
  };

  return (
    <div className="space-y-5">
      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethod(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Methods</option>

          <option value="cash">Cash</option>

          <option value="credit_card">
            Credit Card
          </option>

          <option value="bank_transfer">
            Bank Transfer
          </option>

          <option value="mobile_payment">
            Mobile Payment
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                {[
                  '#',
                  'Patient',
                  'Invoice',
                  'Amount',
                  'Method',
                  'Date',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-slate-400"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-slate-400">
                      PAY-
                      {String(p.id).padStart(4, '0')}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {p.patient
                        ? `${p.patient.nom} ${p.patient.prenom}`
                        : '—'}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                      {p.invoice?.invoice_number ||
                        '—'}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-green-600">
                      {Number(p.amount).toFixed(2)} DZD
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span>
                          {
                            METHOD_ICONS[
                              p.payment_method
                            ]
                          }
                        </span>

                        <span>
                          {
                            METHOD_LABELS[
                              p.payment_method
                            ]
                          }
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(
                        p.payment_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <Badge status={p.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleReceipt(p)
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition"
                        >
                          🧾 Receipt
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(p.id)
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPT */}
      {receipt && (
        <ReceiptModal
          payment={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}