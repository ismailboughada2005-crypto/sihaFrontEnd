'use client';

import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const STATUS_COLORS = {
  unpaid: 'bg-red-100 text-red-600',
  partially_paid: 'bg-yellow-100 text-yellow-600',
  paid: 'bg-green-100 text-green-600',
  refunded: 'bg-purple-100 text-purple-600',
};

const STATUS_LABELS = {
  unpaid: 'Unpaid',
  partially_paid: 'Partial',
  paid: 'Paid',
  refunded: 'Refunded',
};

const Badge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      STATUS_COLORS[status] || 'bg-slate-100 text-slate-600'
    }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>

        <button
          onClick={onClose}
          className="text-2xl text-slate-400 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      <div className="p-6">{children}</div>
    </div>
  </div>
);

function CreateInvoiceModal({ patients, onClose, onCreated }) {
  const [patientId, setPatientId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState([
    {
      description: '',
      quantity: 1,
      unit_price: 0,
      type: 'consultation',
    },
  ]);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        type: 'consultation',
      },
    ]);
  };

  const removeItem = (i) => {
    setItems(items.filter((_, idx) => idx !== i));
  };

  const updateItem = (i, field, val) => {
    setItems(
      items.map((it, idx) =>
        idx === i ? { ...it, [field]: val } : it
      )
    );
  };

  const subtotal = items.reduce(
    (s, it) => s + it.quantity * it.unit_price,
    0
  );

  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      await api.invoices.create({
        patient_id: patientId,
        due_date: dueDate,
        tax_rate: Number(taxRate),
        discount_amount: Number(discount),
        items,
      });

      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500';

  const labelClass =
    'mb-1 block text-xs font-semibold text-slate-700';

  return (
    <Modal title="🧾 Create New Invoice" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Patient *</label>

            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className={inputClass}
            >
              <option value="">Select patient...</option>

              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.prenom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Due Date *</label>

            <input
              required
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tax Rate (%)</label>

            <input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Discount (MAD)</label>

            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-700">
              Invoice Items
            </h4>

            <button
              type="button"
              onClick={addItem}
              className="rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-200"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((it, i) => (
              <div
                key={i}
                className="grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
              >
                <input
                  required
                  placeholder="Description"
                  value={it.description}
                  onChange={(e) =>
                    updateItem(i, 'description', e.target.value)
                  }
                  className={inputClass}
                />

                <input
                  required
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={it.quantity}
                  onChange={(e) =>
                    updateItem(i, 'quantity', Number(e.target.value))
                  }
                  className={inputClass}
                />

                <input
                  required
                  type="number"
                  min="0"
                  placeholder="Price"
                  value={it.unit_price}
                  onChange={(e) =>
                    updateItem(i, 'unit_price', Number(e.target.value))
                  }
                  className={inputClass}
                />

                <select
                  value={it.type}
                  onChange={(e) =>
                    updateItem(i, 'type', e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="consultation">Consult</option>
                  <option value="lab_test">Lab Test</option>
                  <option value="medicine">Medicine</option>
                  <option value="other">Other</option>
                </select>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 rounded-xl bg-slate-50 p-4 text-sm">
          <div className="mb-1 flex justify-between">
            <span>Subtotal</span>
            <strong>{subtotal.toFixed(2)} MAD</strong>
          </div>

          <div className="mb-1 flex justify-between">
            <span>Tax ({taxRate}%)</span>
            <strong>{tax.toFixed(2)} MAD</strong>
          </div>

          <div className="mb-1 flex justify-between">
            <span>Discount</span>
            <strong>- {Number(discount).toFixed(2)} MAD</strong>
          </div>

          <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
            <span>Total</span>
            <span>{total.toFixed(2)} MAD</span>
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            {saving ? 'Creating...' : 'Create Invoice'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function RecordPaymentModal({ invoice, onClose, onSaved }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('cash');
  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSaving(true);

    try {
      await api.payments.create({
        invoice_id: invoice.id,
        amount: Number(amount),
        payment_method: method,
        payment_date: date,
        notes,
      });

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-green-500';

  const labelClass =
    'mb-1 block text-xs font-semibold text-slate-700';

  return (
    <Modal
      title={`💳 Record Payment — ${invoice.invoice_number}`}
      onClose={onClose}
    >
      <div className="mb-5 rounded-xl bg-green-50 p-4 text-sm">
        <div className="flex justify-between">
          <span>Total</span>
          <strong>
            {Number(invoice.total_amount).toFixed(2)} MAD
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Paid</span>

          <strong className="text-green-600">
            {Number(invoice.paid_amount).toFixed(2)} MAD
          </strong>
        </div>

        <div className="flex justify-between font-bold">
          <span>Remaining</span>

          <strong className="text-red-600">
            {Number(invoice.remaining_amount).toFixed(2)} MAD
          </strong>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>Amount *</label>

            <input
              required
              type="number"
              min="0.01"
              max={invoice.remaining_amount}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date *</label>

            <input
              required
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Payment Method *</label>

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={inputClass}
            >
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_payment">Mobile Payment</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Notes</label>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-5 py-2 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white hover:bg-green-700"
          >
            {saving ? 'Saving...' : 'Record Payment'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [payInvoice, setPayInvoice] = useState(null);

  const load = useCallback(() => {
    setLoading(true);

    const params = new URLSearchParams();

    if (search) params.set('search', search);

    if (statusFilter)
      params.set('status', statusFilter);

    const qs = params.toString()
      ? `?${params}`
      : '';

    Promise.all([
      api.invoices.getAll(qs),
      api.patients.getAll(),
    ])
      .then(([inv, pts]) => {
        setInvoices(inv.data || inv || []);
        setPatients(
          Array.isArray(pts)
            ? pts
            : pts.data || []
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;

    try {
      await api.invoices.delete(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const btnStyle = (type) => {
    if (type === 'green') {
      return 'bg-green-100 text-green-600 hover:bg-green-200';
    }

    if (type === 'red') {
      return 'bg-red-100 text-red-600 hover:bg-red-200';
    }

    return 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200';
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          placeholder="🔍 Search invoices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[220px] flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partially_paid">
            Partially Paid
          </option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
        </select>

        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          + New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  'Invoice #',
                  'Patient',
                  'Total',
                  'Paid',
                  'Remaining',
                  'Due Date',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-500"
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
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Loading...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm font-semibold text-indigo-600">
                      {inv.invoice_number}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {inv.patient
                        ? `${inv.patient.nom} ${inv.patient.prenom}`
                        : '—'}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold">
                      {Number(inv.total_amount).toFixed(2)} MAD
                    </td>

                    <td className="px-4 py-3 text-sm text-green-600">
                      {Number(inv.paid_amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-sm text-red-600">
                      {Number(inv.remaining_amount).toFixed(2)}
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {inv.due_date}
                    </td>

                    <td className="px-4 py-3">
                      <Badge status={inv.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {inv.status !== 'paid' &&
                          inv.status !== 'refunded' && (
                            <button
                              onClick={() =>
                                setPayInvoice(inv)
                              }
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${btnStyle(
                                'green'
                              )}`}
                            >
                              💳 Pay
                            </button>
                          )}

                        <button
                          onClick={() =>
                            handleDelete(inv.id)
                          }
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${btnStyle(
                            'red'
                          )}`}
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

      {showCreate && (
        <CreateInvoiceModal
          patients={patients}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}

      {payInvoice && (
        <RecordPaymentModal
          invoice={payInvoice}
          onClose={() => setPayInvoice(null)}
          onSaved={() => {
            setPayInvoice(null);
            load();
          }}
        />
      )}
    </div>
  );
}