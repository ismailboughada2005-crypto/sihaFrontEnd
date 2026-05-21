'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Search, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  ArrowUpRight, 
  ArrowDownLeft,
  X,
  Filter,
  Download,
  CreditCard as CardIcon,
  Banknote,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit2,
  ChevronRight,
  FileText
} from 'lucide-react';
import api from '../services/api';
import KPICard from './KPICard';

const PaymentManagement = ({ patients = [] }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'Credit Card',
    status: 'completed',
    notes: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await api.payments.getAll();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load payments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        patient_id: payment.patient_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_method: payment.payment_method,
        status: payment.status,
        notes: payment.notes || ''
      });
    } else {
      setEditingPayment(null);
      setFormData({
        patient_id: patients[0]?.id || '',
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Credit Card',
        status: 'completed',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingPayment) {
        await api.payments.update(editingPayment.id, formData);
        showToast('Payment updated successfully');
      } else {
        await api.payments.create(formData);
        showToast('Payment recorded successfully');
      }
      fetchPayments();
      setIsModalOpen(false);
    } catch (err) {
      setError('Failed to save payment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (payment) => {
    setPaymentToDelete(payment);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (paymentToDelete) {
      try {
        setLoading(true);
        await api.payments.delete(paymentToDelete.id);
        setPayments(prev => prev.filter(p => p.id !== paymentToDelete.id));
        setIsDeleteModalOpen(false);
        setPaymentToDelete(null);
        showToast('Transaction deleted');
      } catch (err) {
        setError('Failed to delete transaction: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPatientName = (id) => {
    const p = patients.find(p => String(p.id) === String(id));
    return p ? `${p.prenom} ${p.nom}` : 'Unknown Patient';
  };

  const filteredPayments = (Array.isArray(payments) ? payments : []).filter(p => 
    getPatientName(p.patient_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).includes(searchTerm)
  );

  const stats = {
    totalRevenue: (Array.isArray(payments) ? payments : []).reduce((acc, curr) => curr.status === 'completed' ? acc + parseFloat(curr.amount) : acc, 0),
    pendingCount: (Array.isArray(payments) ? payments : []).filter(p => p.status === 'pending').length,
    avgTicket: (Array.isArray(payments) ? payments : []).length > 0 ? (Array.isArray(payments) ? payments : []).reduce((acc, curr) => acc + parseFloat(curr.amount), 0) / (Array.isArray(payments) ? payments : []).length : 0
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Financial Terminal</h2>
          <p className="text-sm font-medium text-on-surface-variant">Global billing coordination and revenue tracking</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-card-bg border border-slate-200 rounded-2xl text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Financials
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <KPICard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} trend="up" trendValue="14.2" icon={DollarSign} color="bg-emerald-600" />
        <KPICard title="Pending Invoices" value={stats.pendingCount} icon={Clock} color="bg-amber-600" />
        <KPICard title="Avg. Transaction" value={`$${stats.avgTicket.toFixed(2)}`} icon={CreditCard} color="bg-indigo-600" />
      </div>

      <div className="bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/20 dark:bg-slate-800/20">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by patient name or ID..." 
              className="bg-surface border border-card-border rounded-2xl w-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold h-12 text-on-surface"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-surface border border-card-border rounded-xl text-slate-400 hover:text-primary transition-colors">
              <Filter className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
              {filteredPayments.length} Transactions
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              <AnimatePresence>
                {filteredPayments.map((pay, i) => (
                  <motion.tr 
                    key={pay.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div>
                        <p className="text-sm font-black text-on-surface">#TR-{pay.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pay.payment_date}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-[10px]">
                          {getPatientName(pay.patient_id).split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{getPatientName(pay.patient_id)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {pay.patient_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-on-surface">${parseFloat(pay.amount).toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {pay.payment_method === 'Credit Card' ? <CreditCard className="w-4 h-4 text-slate-300" /> : <Banknote className="w-4 h-4 text-slate-300" />}
                        <span className="text-xs font-bold text-on-surface-variant">{pay.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                          pay.status === 'completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                          pay.status === 'pending' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                          'bg-rose-50 text-rose-600 ring-rose-100'
                        }`}>
                          {pay.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(pay)}
                          className="p-2.5 bg-card-bg border border-card-border rounded-xl text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(pay)}
                          className="p-2.5 bg-card-bg border border-card-border rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredPayments.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex p-6 bg-surface rounded-full mb-6">
                <DollarSign className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-on-surface">No Transactions Recorded</h3>
              <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm mx-auto">Start by recording a new patient payment in the ledger.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-card-bg rounded-[2.5rem] shadow-2xl overflow-hidden border border-card-border">
              <div className="p-8 border-b border-card-border flex justify-between items-center bg-surface/50 dark:bg-slate-800/10">
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tight">{editingPayment ? 'Modify Transaction' : 'Record New Payment'}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Financial Reconciliation</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-card-bg shadow-sm border border-card-border hover:bg-item-hover transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                    <select 
                      required
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.patient_id}
                      onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    >
                      <option value="">Select Patient...</option>
                      {patients.map(p => <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.id})</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ($)</label>
                    <input 
                      required type="number" step="0.01"
                      placeholder="0.00"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Date</label>
                    <input 
                      required type="date" 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.payment_date}
                      onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Method</label>
                    <select 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    >
                      <option>Credit Card</option>
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Insurance</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <select 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                    <textarea 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[100px]"
                      placeholder="Transaction details, reference numbers..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-card-bg dark:bg-slate-800 transition-colors">Discard</button>
                  <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                    {editingPayment ? 'Update Ledger' : 'Post Transaction'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-card-bg rounded-[2.5rem] shadow-2xl p-10 overflow-hidden text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Revert Transaction?</h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                Are you sure you want to remove this payment record for <span className="font-black text-on-surface">{getPatientName(paymentToDelete?.patient_id)}</span>? This cannot be undone.
              </p>
              <div className="mt-10 flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-card-bg dark:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">Revert Now</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;
