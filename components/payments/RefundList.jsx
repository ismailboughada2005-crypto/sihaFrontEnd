'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>

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

function CreateRefundModal({ payments, onClose, onCreated }) {
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedPayment = payments.find(
    (p) => String(p.id) === String(paymentId)
  );

  const alreadyRefunded =
    selectedPayment?.refunds?.reduce(
      (s, r) => s + Number(r.amount),
      0
    ) || 0;

  const maxRefund = selectedPayment
    ? Number(selectedPayment.amount) - alreadyRefunded
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      await api.refunds.create({
        payment_id: Number(paymentId),
        amount: Number(amount),
        reason,
        refund_date: date,
      });

      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="💸 Process Refund" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PAYMENT */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Payment *
          </label>

          <select
            required
            value={paymentId}
            onChange={(e) => {
              setPaymentId(e.target.value);
              setAmount('');
            }}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select payment...</option>

            {payments
              .filter((p) => p.status !== 'refunded')
              .map((p) => (
                <option key={p.id} value={p.id}>
                  PAY-{String(p.id).padStart(4, '0')} —{' '}
                  {p.patient?.nom} {p.patient?.prenom} —{' '}
                  {Number(p.amount).toFixed(2)} MAD
                </option>
              ))}
          </select>
        </div>

        {/* INFO BOX */}
        {selectedPayment && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm space-y-1">
            <div>
              Total paid:{' '}
              <span className="font-bold text-slate-800">
                {Number(selectedPayment.amount).toFixed(2)} MAD
              </span>
            </div>

            <div>
              Already refunded:{' '}
              <span className="font-bold text-red-500">
                {alreadyRefunded.toFixed(2)} MAD
              </span>
            </div>

            <div>
              Available to refund:{' '}
              <span className="font-bold text-green-600">
                {maxRefund.toFixed(2)} MAD
              </span>
            </div>
          </div>
        )}

        {/* AMOUNT */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Refund Amount (MAD) *
          </label>

          <input
            required
            type="number"
            min="0.01"
            max={maxRefund || undefined}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* DATE */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Refund Date *
          </label>

          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* REASON */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason *
          </label>

          <textarea
            required
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for refund..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition"
          >
            {saving ? 'Processing...' : 'Process Refund'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function RefundList() {
  const [refunds, setRefunds] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(() => {
    setLoading(true);

    Promise.all([
      api.refunds.getAll(),
      api.payments.getAll(),
    ])
      .then(([r, p]) => {
        setRefunds(r.data || r || []);
        setPayments(p.data || p || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (
      !confirm(
        'Reverse this refund? The payment balance will be restored.'
      )
    )
      return;

    try {
      await api.refunds.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-sm transition"
        >
          + New Refund
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                {[
                  'Refund #',
                  'Payment',
                  'Patient',
                  'Amount',
                  'Reason',
                  'Date',
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
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : refunds.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-slate-400"
                  >
                    No refunds found.
                  </td>
                </tr>
              ) : (
                refunds.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 text-sm text-slate-400">
                      REF-{String(r.id).padStart(4, '0')}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                      PAY-{String(r.payment_id).padStart(4, '0')}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {r.payment?.patient
                        ? `${r.payment.patient.nom} ${r.payment.patient.prenom}`
                        : '—'}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-red-500">
                      - {Number(r.amount).toFixed(2)} MAD
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500 max-w-[220px] truncate">
                      {r.reason}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(
                        r.refund_date
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      >
                        Reverse
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showCreate && (
        <CreateRefundModal
          payments={payments}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}
    </div>
  );
}