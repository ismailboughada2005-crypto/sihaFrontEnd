'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  CheckCircle,
  Search,
  Filter,
  MoreVertical,
  Check,
  X,
  AlertCircle,
  FileText,
  ChevronDown,
  ExternalLink,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import KPICard from './KPICard';
import api from '../services/api';

const DoctorAppointments = ({ appointments, stats, filters, setFilters, refreshData }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalType, setModalType] = useState(null); // 'confirm', 'cancel', 'complete'
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async () => {
    if (!selectedAppointment) return;
    setProcessing(true);
    try {
      if (modalType === 'confirm') {
        await api.doctorAppointments.confirm(selectedAppointment.id);
        showToast('Appointment confirmed successfully');
      } else if (modalType === 'cancel') {
        if (!reason) throw new Error('Cancellation reason is required');
        await api.doctorAppointments.cancel(selectedAppointment.id, reason);
        showToast('Appointment cancelled');
      } else if (modalType === 'complete') {
        await api.doctorAppointments.complete(selectedAppointment.id, reason);
        showToast('Appointment marked as completed');
      }
      setModalType(null);
      setSelectedAppointment(null);
      setReason('');
      refreshData();
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-600 ring-emerald-100';
      case 'cancelled': return 'bg-rose-50 text-rose-600 ring-rose-100';
      case 'completed': return 'bg-blue-50 text-blue-600 ring-blue-100';
      default: return 'bg-amber-50 text-amber-600 ring-amber-100';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Appointment Management</h2>
          <p className="text-sm font-medium text-slate-500">Manage your schedule and patient consultations</p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Total Appointments" value={stats.total} icon={Calendar} color="bg-indigo-600" />
        <KPICard title="Today" value={stats.today} icon={Clock} color="bg-orange-500" />
        <KPICard title="Confirmed" value={stats.confirmed} icon={CheckCircle2} color="bg-teal-500" />
        <KPICard title="Pending" value={stats.pending} icon={AlertCircle} color="bg-amber-500" />
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by patient name..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider outline-none"
            value={filters.date_filter}
            onChange={(e) => setFilters({...filters, date_filter: e.target.value})}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <select 
            className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider outline-none"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date & Time</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notes</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.length > 0 ? appointments.map((app, idx) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-on-surface">{app.patient?.prenom} {app.patient?.nom}</p>
                        <p className="text-[10px] font-bold text-slate-400">ID: #{app.patient?.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-on-surface">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(app.appointment_date).toLocaleDateString('en-GB')}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {app.appointment_time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-slate-500 max-w-[200px] truncate">
                      {app.notes || <span className="italic text-slate-300">No notes</span>}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => { setSelectedAppointment(app); setModalType('confirm'); }}
                            className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedAppointment(app); setModalType('cancel'); }}
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {app.status === 'confirmed' && (
                        <button 
                          onClick={() => { setSelectedAppointment(app); setModalType('complete'); }}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm text-[10px] font-black uppercase tracking-widest"
                        >
                          Mark Complete
                        </button>
                      )}
                      {app.status === 'completed' && (
                        <div className="text-emerald-500 flex items-center gap-1 text-[10px] font-black uppercase">
                          <CheckCircle className="w-4 h-4" /> Done
                        </div>
                      )}
                      {app.status === 'cancelled' && (
                        <div className="text-rose-400 flex items-center gap-1 text-[10px] font-black uppercase">
                          <XCircle className="w-4 h-4" /> Cancelled
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-slate-400">No appointments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {modalType && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                  modalType === 'cancel' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {modalType === 'cancel' ? <XCircle className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
                </div>
                
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2 uppercase">
                  {modalType === 'confirm' ? 'Confirm Appointment' : 
                   modalType === 'cancel' ? 'Cancel Appointment' : 
                   'Complete Appointment'}
                </h3>
                <p className="text-slate-500 font-medium mb-6">
                  {modalType === 'confirm' ? 'Are you sure you want to confirm this appointment with ' : 
                   modalType === 'cancel' ? 'Please provide a reason for cancelling the appointment with ' : 
                   'Add any final clinical notes for '}
                  <span className="font-black text-on-surface">
                    {selectedAppointment?.patient?.prenom} {selectedAppointment?.patient?.nom}
                  </span>.
                </p>

                {(modalType === 'cancel' || modalType === 'complete') && (
                  <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none mb-6 min-h-[100px]"
                    placeholder={modalType === 'cancel' ? "Reason for cancellation..." : "Clinical notes..."}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                )}

                <div className="flex gap-3">
                  <button 
                    onClick={() => { setModalType(null); setSelectedAppointment(null); setReason(''); }}
                    className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={handleAction}
                    disabled={processing}
                    className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
                      modalType === 'cancel' 
                        ? 'bg-rose-600 text-white shadow-rose-200' 
                        : 'bg-primary text-white shadow-primary/20'
                    } ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                  >
                    {processing ? 'Processing...' : 'Confirm Action'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border border-slate-800 bg-slate-900 text-white"
          >
            {toast.type === 'error' ? <XCircle className="w-5 h-5 text-rose-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorAppointments;
