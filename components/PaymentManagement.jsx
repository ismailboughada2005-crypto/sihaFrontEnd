'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Clock
} from 'lucide-react';

const PaymentManagement = ({ patients = [] }) => {
  const [payments, setPayments] = useState([
    { 
      id: 1001, 
      patientId: '#P-1123', 
      patientName: 'James Wilson', 
      montant: 150.00, 
      datePaiement: '2024-05-15', 
      modePaiement: 'Credit Card', 
      statut: 'Completed',
      invoice: { numero: 'INV-2024-001', date: '2024-05-15', montant: 150.00 }
    },
    { 
      id: 1002, 
      patientId: '#P-2234', 
      patientName: 'Maria Garcia', 
      montant: 85.50, 
      datePaiement: '2024-05-15', 
      modePaiement: 'Insurance', 
      statut: 'Pending',
      invoice: null
    },
    { 
      id: 1003, 
      patientId: '#P-3321', 
      patientName: 'Robert Fox', 
      montant: 200.00, 
      datePaiement: '2024-05-14', 
      modePaiement: 'Cash', 
      statut: 'Completed',
      invoice: { numero: 'INV-2024-002', date: '2024-05-14', montant: 200.00 }
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    patientId: '',
    montant: '',
    datePaiement: new Date().toISOString().split('T')[0],
    modePaiement: 'Credit Card',
    statut: 'Completed'
  });

  const [invoiceForm, setInvoiceForm] = useState({
    numero: '',
    date: new Date().toISOString().split('T')[0],
    montant: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === formData.patientId);
    const newPayment = {
      ...formData,
      id: Math.floor(Math.random() * 9000) + 1000,
      patientName: patient ? `${patient.prenom} ${patient.nom}` : 'Unknown Patient',
      montant: parseFloat(formData.montant),
      invoice: null
    };
    setPayments(prev => [newPayment, ...prev]);
    setIsModalOpen(false);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerateInvoice = (payment) => {
    setSelectedPayment(payment);
    setInvoiceForm({
      numero: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      montant: payment.montant
    });
    setIsInvoiceModalOpen(true);
  };

  const saveInvoice = (e) => {
    e.preventDefault();
    setPayments(prev => prev.map(p => 
      p.id === selectedPayment.id 
      ? { ...p, invoice: { ...invoiceForm, montant: parseFloat(invoiceForm.montant) } } 
      : p
    ));
    setIsInvoiceModalOpen(false);
    showToast('Invoice generated successfully!');
  };

  const filteredPayments = payments.filter(p => 
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toString().includes(searchTerm)
  );

  const totalRevenue = payments.reduce((acc, curr) => curr.statut === 'Completed' ? acc + curr.montant : acc, 0);

  const handleDeletePayment = (pay) => {
    setPaymentToDelete(pay);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (paymentToDelete) {
      setPayments(prev => prev.filter(p => p.id != paymentToDelete.id));
      setIsDeleteModalOpen(false);
      setPaymentToDelete(null);
      showToast('Transaction deleted');
    }
  };

  const handleExport = () => {
    showToast(`Exporting ${payments.length} financial records...`);
  };

  const handleDownloadInvoice = (payment) => {
    if (!payment.invoice) {
      showToast("Invoice not generated yet", "error");
      return;
    }
    showToast(`Downloading ${payment.invoice.numero}...`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'error' ? 'bg-rose-500 border-rose-400 text-white' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {toast.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">Financial Ledger</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">Monitor transactions, billing cycles, and revenue flow</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase text-slate-500 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export records
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Log New Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Revenue</p>
              <h4 className="text-2xl font-black text-on-surface">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
            <ArrowUpRight className="w-4 h-4" /> 12.5% increase from last month
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Invoices</p>
              <h4 className="text-2xl font-black text-on-surface">{payments.filter(p => p.statut === 'Pending').length}</h4>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400">Awaiting processing or insurance clearance</p>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              <CardIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Ticket Value</p>
              <h4 className="text-2xl font-black text-on-surface">${(totalRevenue / (payments.length || 1)).toFixed(2)}</h4>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-400">Based on processed transactions</p>
        </div>
      </div>

      <div className="bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-card-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient or ID..." 
              className="w-full bg-card-bg border border-card-border rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => showToast("Filter criteria: Last 30 days, All methods.")}
               className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-600 hover:bg-slate-50"
             >
               <Filter className="w-4 h-4" /> Filter
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Paiement ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Montant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mode</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Facture</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((pay, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={pay.id} 
                  className="group hover:bg-item-hover transition-colors border-b last:border-none border-card-border"
                >
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-black text-on-surface">#P-{pay.id}</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{pay.datePaiement}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-400 text-[10px]">
                        {pay.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-700">{pay.patientName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{pay.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-on-surface">${pay.montant.toFixed(2)}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       {pay.modePaiement === 'Credit Card' ? <CreditCard className="w-3.5 h-3.5 text-slate-400" /> : <Banknote className="w-3.5 h-3.5 text-slate-400" />}
                       <span className="text-xs font-bold text-slate-600">{pay.modePaiement}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      pay.statut === 'Completed' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                    }`}>
                      {pay.statut === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {pay.statut}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {pay.invoice ? (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary uppercase">{pay.invoice.numero}</span>
                        <span className="text-[8px] font-bold text-slate-400">${pay.invoice.montant.toFixed(2)}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleGenerateInvoice(pay)}
                        className="text-[9px] font-black text-slate-300 uppercase hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Generate
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end opacity-20 group-hover:opacity-100 transition-all duration-300">
                       <button 
                         onClick={() => handleDownloadInvoice(pay)}
                         className="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg cursor-pointer" 
                         title="Download Invoice"
                       >
                         <Download className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => handleDeletePayment(pay)}
                         className="p-2 text-slate-400 hover:text-rose-500 transition-colors hover:bg-white rounded-lg cursor-pointer"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-card-bg rounded-[2.5rem] shadow-2xl overflow-hidden border border-card-border">
               <div className="p-8 border-b border-card-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
                 <h3 className="text-xl font-black text-on-surface tracking-tight">Record New Transaction</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Patient</label>
                   <select 
                     required
                     className="w-full bg-slate-50 dark:bg-slate-800/50 border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none text-on-surface"
                     value={formData.patientId}
                     onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                   >
                     <option value="">Choose patient...</option>
                     {patients.map(p => (
                       <option key={p.id} value={p.id}>{p.prenom} {p.nom} ({p.id})</option>
                     ))}
                   </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Montant ($)</label>
                      <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" placeholder="0.00" value={formData.montant} onChange={(e) => setFormData({...formData, montant: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Paiement</label>
                       <input required type="date" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={formData.datePaiement} onChange={(e) => setFormData({...formData, datePaiement: e.target.value})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode Paiement</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none" value={formData.modePaiement} onChange={(e) => setFormData({...formData, modePaiement: e.target.value})}>
                        <option>Credit Card</option>
                        <option>Bank Transfer</option>
                        <option>Insurance</option>
                        <option>Cash</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut Initial</label>
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none" value={formData.statut} onChange={(e) => setFormData({...formData, statut: e.target.value})}>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>Refunded</option>
                      </select>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase text-slate-400 tracking-widest transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Record Transaction</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden">
              <div className="text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                  <Trash2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Annuler la Transaction?</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer le paiement de <span className="font-black text-on-surface">{paymentToDelete?.patientName}</span> (#P-{paymentToDelete?.id})?
                </p>
                
                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-[0.98]"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Generation Modal */}
      <AnimatePresence>
        {isInvoiceModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInvoiceModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/10 rounded-lg text-primary">
                     <Download className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-black text-on-surface tracking-tight">Generate Invoice</h3>
                 </div>
                 <button onClick={() => setIsInvoiceModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               
               <form onSubmit={saveInvoice} className="p-8 space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Number (Numero)</label>
                   <input 
                     required 
                     type="text" 
                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" 
                     placeholder="INV-XXXX" 
                     value={invoiceForm.numero} 
                     onChange={(e) => setInvoiceForm({...invoiceForm, numero: e.target.value})} 
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Amount (Montant)</label>
                      <input required type="number" step="0.01" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={invoiceForm.montant} onChange={(e) => setInvoiceForm({...invoiceForm, montant: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Date</label>
                       <input required type="date" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={invoiceForm.date} onChange={(e) => setInvoiceForm({...invoiceForm, date: e.target.value})} />
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase text-slate-400 tracking-widest transition-all">Cancel</button>
                    <button type="submit" className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Save & Finalize</button>
                 </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentManagement;
