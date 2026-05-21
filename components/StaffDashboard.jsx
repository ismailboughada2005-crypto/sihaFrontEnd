'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BadgeCheck, 
  Clock, 
  ClipboardList, 
  Plus, 
  ChevronRight,
  ClipboardCheck,
  Building,
  AlertCircle,
  X,
  User,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-react';
import KPICard from './KPICard';
import api from '../services/api';

const StaffDashboard = ({ patients = [], doctors = [], appointments = [], refreshData }) => {
  const [activeWing, setActiveWing] = useState('All');
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); // For quick status update modal
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    status: 'Waiting',
    dept: 'Cardiology',
    room_id: ''
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Keep form data default state updated when patients or doctors change
  useEffect(() => {
    if (patients.length > 0 && !formData.patient_id) {
      setFormData(prev => ({ ...prev, patient_id: patients[0].id }));
    }
  }, [patients]);

  useEffect(() => {
    if (doctors.length > 0 && !formData.doctor_id) {
      setFormData(prev => ({ ...prev, doctor_id: doctors[0].id }));
    }
  }, [doctors]);



  // Calculate stats dynamically
  const activePatients = patients.filter(p => ['Active', 'Waiting'].includes(p.status));
  const checkInCount = activePatients.length;

  

  const waitingPatients = patients.filter(p => p.status === 'Waiting');
  const avgWaitMinutes = waitingPatients.length * 15 || 10;
  const avgWaitText = `${avgWaitMinutes}m`;
  const waitTrend = waitingPatients.length > 2 ? 'up' : 'down';
  const waitTrendVal = waitingPatients.length > 2 ? '15%' : '8%';

  const pendingBillingCount = patients.filter(p => p.status === 'Completed').length;

  // Process live rooming data
  const checkins = (patients || [])
    .filter(p => ['Active', 'Waiting', 'Completed'].includes(p.status))
    .map(p => {
      // Find latest appointment for this patient
      const app = appointments.find(a => String(a.patient_id) === String(p.id));
      const doctor = app ? doctors.find(d => String(d.id) === String(app.doctor_id)) : null;
      const doctorName = doctor ? `Dr. ${doctor.nom}` : 'Staff Duty';
      
      const roomName = app && app.room_id ? `Room ${app.room_id}` : 'Waiting Area';

      return {
        id: p.id,
        p: `${p.prenom} ${p.nom}`,
        doc: doctorName,
        status: p.status || 'Active',
        color: p.status === 'Active' ? 'blue' : p.status === 'Waiting' ? 'amber' : 'emerald',
        room: roomName,
        dept: p.dept || 'General'
      };
    })
    .filter(item => {
      if (activeWing === 'All') return true;
      if (activeWing === 'Main') return ['Cardiology', 'Neurology', 'Pediatrics'].includes(item.dept);
      if (activeWing === 'Diagnostics') return ['Dermatology', 'Physiotherapy'].includes(item.dept);
      return true;
    });

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patient_id || !formData.doctor_id) {
      showToast('Please select a patient and a doctor', 'error');
      return;
    }
    setLoading(true);
    try {
      const patient = patients.find(p => String(p.id) === String(formData.patient_id));
      if (!patient) throw new Error('Patient not found');

      // Update patient status & department
      await api.patients.update(patient.id, {
        ...patient,
        status: formData.status,
        dept: formData.dept
      });

      // Create quick appointment for today with assigned room
      await api.appointments.create({
        patient_id: patient.id,
        doctor_id: formData.doctor_id,
        room_id: formData.room_id || null,
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        type: 'Consultation',
        status: formData.status === 'Active' ? 'confirmed' : 'pending',
        notes: 'Checked in via Staff Hub'
      });

      

      setCheckInModalOpen(false);
      await refreshData();
      showToast('Patient checked in successfully');
    } catch (err) {
      showToast(err.message || 'Failed to check-in patient', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (patientId, newStatus) => {
    setLoading(true);
    try {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        await api.patients.update(patientId, {
          ...patient,
          status: newStatus
        });
        
        // Find corresponding appointment to update status and release room
        const app = appointments.find(a => String(a.patient_id) === String(patientId));
        if (app) {
          let apiStatus = 'pending';
          if (newStatus === 'Active') apiStatus = 'confirmed';
          if (newStatus === 'Completed') apiStatus = 'completed';
          
          await api.appointments.update(app.id, {
            ...app,
            status: apiStatus
          });

          
        }
      }
      setSelectedPatient(null);
      await refreshData();
      showToast(`Patient status updated to ${newStatus}`);
    } catch (err) {
      showToast(err.message || 'Failed to update patient status', 'error');
    } finally {
      setLoading(false);
    }
  };



  // Determine percentages for Facility Health dynamically based on checkins
  const getDeptCount = (depts) => checkins.filter(c => depts.includes(c.dept)).length;
  const loungeVal = Math.min(100, Math.max(10, getDeptCount(['Cardiology', 'Neurology', 'Pediatrics']) * 20));
  const labVal = Math.min(100, Math.max(10, getDeptCount(['Dermatology', 'Physiotherapy']) * 25));
  const parkingVal = Math.min(100, Math.max(60, 95 - activePatients.length * 3));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
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

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Staff Hub</h2>
          <p className="text-sm font-medium text-on-surface-variant">Coordinating patient flow & facility logistics</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setCheckInModalOpen(true)}
            className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Check-in Patient
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Check-ins" value={String(checkInCount)} icon={Home} color="bg-blue-600" />
        
        <KPICard title="Avg Wait" value={avgWaitText} trend={waitTrend} trendValue={waitTrendVal} icon={Clock} color="bg-rose-600" />
        <KPICard title="Pending Billing" value={String(pendingBillingCount)} icon={ClipboardList} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-[118rem]">
        {/* Active Rooming Table */}
        <div className="xl:col-span-8 bg-card-bg p-8 rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-xl font-black text-on-surface tracking-tight">Active Rooming</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live patient coordination</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveWing('All')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeWing === 'All' ? 'bg-primary/10 text-primary' : 'border border-card-border text-slate-400 hover:bg-surface'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveWing('Main')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeWing === 'Main' ? 'bg-primary/10 text-primary' : 'border border-card-border text-slate-400 hover:bg-surface'
                }`}
              >
                Main Wing
              </button>
              <button 
                onClick={() => setActiveWing('Diagnostics')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                  activeWing === 'Diagnostics' ? 'bg-primary/10 text-primary' : 'border border-card-border text-slate-400 hover:bg-surface'
                }`}
              >
                Diagnostics
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-surface rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              <span>Patient</span>
              <span>Provider</span>
              <span className="text-center">Status</span>
              <span className="text-right">Room</span>
            </div>
            
            <AnimatePresence>
              {checkins.length > 0 ? checkins.map((row, i) => (
                <motion.div 
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedPatient(row)}
                  className="grid grid-cols-4 gap-4 px-6 py-5 hover:bg-surface/50 transition-colors border-b border-card-border items-center group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 bg-card-bg dark:bg-slate-800 rounded-lg flex items-center justify-center">
                       <ClipboardCheck className="w-4 h-4 text-slate-400" />
                     </div>
                     <span className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{row.p}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">{row.doc}</span>
                  <div className="flex justify-center">
                     <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                      row.color === 'blue' ? 'bg-blue-50 text-blue-600 ring-blue-100' :
                      row.color === 'amber' ? 'bg-amber-50 text-amber-600 ring-amber-100' :
                      row.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' :
                      'bg-indigo-50 text-indigo-600 ring-indigo-100'
                    }`}>
                      {row.status}
                    </span>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <span className="text-xs font-black text-slate-450">{row.room}</span>
                    <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              )) : (
                <div className="py-12 text-center text-slate-400 font-bold text-sm">
                  No checked-in patients in this wing.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Facility Health & Sidebar Actions */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden h-[33rem]">
             <div className="flex items-center justify-between mb-8 relative z-10">
               <div>
                 <h3 className="text-lg font-black tracking-tight">Facility Health</h3>
                 <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Real-time capacity</p>
               </div>
               <Building className="w-10 h-10 text-white/10" />
             </div>

             <div className="space-y-6 relative z-10">
               {[
                 { label: 'Patient Lounges', val: loungeVal },
                 { label: 'Lab Queues', val: labVal },
                 { label: 'Parking Alpha', val: parkingVal },
               ].map((item, i) => (
                 <div key={i}>
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3 text-white/50">
                     <span>{item.label}</span>
                     <span className={item.val > 90 ? 'text-rose-400' : 'text-white'}>{item.val}%</span>
                   </div>
                   <div className="h-1.5 bg-card-bg/10 rounded-full overflow-hidden">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${item.val}%` }}
                       className={`h-full rounded-full ${item.val > 90 ? 'bg-rose-500' : 'bg-primary/20'}`} 
                     />
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-12 p-5 bg-card-bg/5 border border-white/10 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-[10px] font-bold text-white/70 leading-relaxed uppercase tracking-tighter">
                  {waitingPatients.length > 2 
                    ? 'Wait times in General Wing are trending high. Divert incoming non-emergency patients.'
                    : 'Clinic operations are running smoothly. All capacities within bounds.'}
                </p>
             </div>
          </div>
          
          <button 
            onClick={() => setCheckInModalOpen(true)}
            className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 group bg-card-bg shadow-sm hover:shadow-md"
          >
            <Plus className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            Quick Patient Check-in
          </button>
        </div>
      </div>

      {/* Check-in Dialog */}
      <AnimatePresence>
        {checkInModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card-bg w-full max-w-md rounded-[2.5rem] shadow-2xl border border-card-border overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase">Patient Check-in</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Setup rooming and provider</p>
                  </div>
                  <button onClick={() => setCheckInModalOpen(false)} className="p-2 text-slate-400 hover:text-on-surface-variant rounded-xl hover:bg-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCheckInSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Patient</label>
                    <select 
                      className="w-full bg-surface border border-card-border rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.patient_id}
                      onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.prenom} {p.nom}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign Doctor</label>
                    <select 
                      className="w-full bg-surface border border-card-border rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                    >
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.nom}</option>
                      ))}
                    </select>
                  </div>

                  

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Status</label>
                      <select 
                        className="w-full bg-surface border border-card-border rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Active">Active (In Session)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</label>
                      <select 
                        className="w-full bg-surface border border-card-border rounded-2xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                        value={formData.dept}
                        onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Physiotherapy">Physiotherapy</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setCheckInModalOpen(false)}
                      className="flex-1 py-4 bg-surface text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-card-bg dark:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Checking in...' : 'Check-in'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Row Action Dialog */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card-bg w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-card-border overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-black text-on-surface tracking-tight uppercase">Room Coordination</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{selectedPatient.p}</p>
                  </div>
                  <button onClick={() => setSelectedPatient(null)} className="p-2 text-slate-400 hover:text-on-surface-variant rounded-xl hover:bg-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedPatient.status !== 'Active' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedPatient.id, 'Active')}
                      disabled={loading}
                      className="w-full py-4 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Activity className="w-4 h-4" /> Move to Doctor (Active)
                    </button>
                  )}

                  {selectedPatient.status !== 'Waiting' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedPatient.id, 'Waiting')}
                      disabled={loading}
                      className="w-full py-4 bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Clock className="w-4 h-4" /> Move to Waiting Lounge
                    </button>
                  )}

                  <button 
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'Completed')}
                    disabled={loading}
                    className="w-full py-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Discharge Patient / Finish Session
                  </button>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => setSelectedPatient(null)}
                    className="w-full py-4 bg-surface text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-card-bg dark:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffDashboard;
