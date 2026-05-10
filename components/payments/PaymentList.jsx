"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Eye, Receipt, Trash2, CreditCard } from "lucide-react";
import api from "../../services/api";

const METHOD_ICONS = {
  cash: "",
  credit_card: "",
  bank_transfer: "",
  mobile_payment: "",
};

const METHOD_LABELS = {
  cash: "Cash",
  credit_card: "Credit Card",
  bank_transfer: "Bank Transfer",
  mobile_payment: "Mobile",
};

const STATUS_STYLES = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-yellow-50 text-yellow-600",
  failed: "bg-red-50 text-red-600",
};

const Badge = ({ status }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
      STATUS_STYLES[status] || "bg-slate-100 text-slate-500"
    }`}
  >
    {status}
  </span>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-auto max-h-[90vh]">
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

function ReceiptModal({ payment, onClose }) {
  const p = payment;

  const handlePrint = () => window.print();

  return (
    <Modal title="Payment Receipt" onClose={onClose}>
      <div className="font-serif">
        {/* HEADER */}
        <div className="text-center border-b-2 border-dashed border-slate-200 pb-5 mb-6">
          <h2 className="text-2xl font-bold text-indigo-500">Siha Clinic</h2>

          <p className="text-sm text-slate-500 mt-1">
            Official Payment Receipt
          </p>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm leading-7 mb-6">
          <div>
            <strong>Receipt #:</strong> PAY-{String(p.id).padStart(6, "0")}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {new Date(p.payment_date).toLocaleDateString()}
          </div>

          <div>
            <strong>Patient:</strong>{" "}
            {p.patient ? `${p.patient.nom} ${p.patient.prenom}` : "—"}
          </div>

          <div>
            <strong>Invoice:</strong> {p.invoice?.invoice_number || "—"}
          </div>

          <div>
            <strong>Method:</strong>{" "}
            {METHOD_LABELS[p.payment_method] || p.payment_method}
          </div>

          <div>
            <strong>Status:</strong> {p.status}
          </div>
        </div>

        {/* AMOUNT */}
        <div className="bg-green-50 rounded-2xl p-6 text-center mb-6">
          <div className="text-sm text-slate-500">Amount Paid</div>

          <div className="text-4xl font-bold text-green-600 mt-2">
            {Number(p.amount).toFixed(2)} MAD
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
          Thank you for your payment. Keep this receipt for your records.
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
          Print
        </button>
      </div>
    </Modal>
  );
}

function DetailsModal({ payment, onClose }) {
  const p = payment;
  const labelClass = "text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1";
  const valueClass = "text-sm font-bold text-slate-800";

  return (
    <Modal title="Transaction Detailed Analysis" onClose={onClose}>
      <div className="space-y-8">
        {/* Header Info */}
        <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <div>
            <div className={labelClass}>Transaction ID</div>
            <div className="text-xl font-black text-indigo-600">PAY-{String(p.id).padStart(6, "0")}</div>
          </div>
          <div className="text-right">
            <div className={labelClass}>Status</div>
            <Badge status={p.status} />
          </div>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className={labelClass}>Patient Details</div>
            <div className={valueClass}>{p.patient ? `${p.patient.nom} ${p.patient.prenom}` : "N/A"}</div>
            <div className="text-xs text-slate-500 mt-1">{p.patient?.email || "No email provided"}</div>
          </div>
          <div>
            <div className={labelClass}>Payment Timeline</div>
            <div className={valueClass}>{new Date(p.payment_date).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
            <div className="text-xs text-slate-500 mt-1">{new Date(p.payment_date).toLocaleTimeString()}</div>
          </div>
          <div>
            <div className={labelClass}>Billing Method</div>
            <div className={valueClass}>{METHOD_LABELS[p.payment_method] || p.payment_method}</div>
          </div>
          <div>
            <div className={labelClass}>Reference Invoice</div>
            <div className="text-sm font-bold text-indigo-500 underline">{p.invoice?.invoice_number || "Direct Payment"}</div>
          </div>
        </div>

        {/* Financials */}
        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Settlement Amount</div>
              <div className="text-4xl font-black mt-1">{Number(p.amount).toLocaleString()} <span className="text-lg opacity-80">MAD</span></div>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Notes */}
        {p.notes && (
          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-2">Audit Notes</div>
            <p className="text-sm text-amber-900 leading-relaxed italic">"{p.notes}"</p>
          </div>
        )}

        {/* Footer Audit */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
              {p.processor?.name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400">Processed By</div>
              <div className="text-xs font-bold text-slate-600">{p.processor?.name || "System Administrator"}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Close Report
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatus] = useState("");
  const [methodFilter, setMethod] = useState("");
  const [search, setSearch] = useState("");

  const [receipt, setReceipt] = useState(null);
  const [viewingPayment, setViewingPayment] = useState(null);

  const load = useCallback(() => {
    setLoading(true);

    const params = new URLSearchParams();

    if (statusFilter) params.set("status", statusFilter);
    if (methodFilter) params.set("payment_method", methodFilter);
    if (search) params.set("search", search);

    const qs = params.toString() ? `?${params}` : "";

    api.payments
      .getAll(qs)
      .then((res) => setPayments(res.data || res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter, methodFilter, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this payment? This will reverse the invoice balance."))
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
      const data = await api.payments.receipt(payment.id);

      setReceipt(data);
    } catch {
      setReceipt(payment);
    }
  };

  return (
    <div className="space-y-5">
      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        <input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[220px] flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethod(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Methods</option>

          <option value="cash">Cash</option>

          <option value="credit_card">Credit Card</option>

          <option value="bank_transfer">Bank Transfer</option>

          <option value="mobile_payment">Mobile Payment</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b">
                {[
                  "#",
                  "Patient",
                  "Invoice",
                  "Amount",
                  "Method",
                  "Date",
                  "Status",
                  "Actions",
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
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
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
                      {String(p.id).padStart(4, "0")}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {p.patient ? `${p.patient.nom} ${p.patient.prenom}` : "—"}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                      {p.invoice?.invoice_number || "—"}
                    </td>

                    <td className="px-4 py-3 text-sm font-bold text-green-600">
                      {Number(p.amount).toFixed(2)} MAD
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <span>{METHOD_ICONS[p.payment_method]}</span>

                        <span>{METHOD_LABELS[p.payment_method]}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(p.payment_date).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <Badge status={p.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingPayment(p)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleReceipt(p)}
                          className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                          title="Generate Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Transaction"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <ReceiptModal payment={receipt} onClose={() => setReceipt(null)} />
      )}
      {/* DETAILS */}
      {viewingPayment && (
        <DetailsModal payment={viewingPayment} onClose={() => setViewingPayment(null)} />
      )}
    </div>
  );
}
