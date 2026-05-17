'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Plus, 
  Search, 
  MoreVertical, 
  CheckCircle, 
  X, 
  ChevronRight,
  TrendingUp,
  Trash2,
  Edit2
} from 'lucide-react';
import api from '../services/api';

const AppointmentManager = ({ appointments, setAppointments, patients, doctors }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    type: 'Consultation',
    status: 'pending',
    notes: ''
  });

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormData({ 
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        type: appointment.type,
        status: appointment.status = 'pending',
        notes: appointment.notes || ''
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        patient_id: patients[0]?.id || '',
        doctor_id: doctors[0]?.id || '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '09:00',
        type: 'Consultation',
        status: 'pending',
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAppointment) {
        const updated = await api.appointments.update(editingAppointment.id, formData);
        setAppointments(appointments.map(a => a.id === editingAppointment.id ? { ...updated, id: a.id } : a));
      } else {
        const newAppointment = await api.appointments.create(formData);
        setAppointments([{ ...newAppointment }, ...appointments]);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to save appointment: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (appointment) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (appointmentToDelete) {
      try {
        setLoading(true);
        await api.appointments.delete(appointmentToDelete.id);
        setAppointments(appointments.filter(a => a.id !== appointmentToDelete.id));
        setIsDeleteModalOpen(false);
        setAppointmentToDelete(null);
        setError(null);
      } catch (err) {
        setError('Failed to cancel appointment: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getPatientName = (id) => {
    const p = patients.find(p => String(p.id) === String(id));
    if (!p) return 'Unknown Patient';
    return (p.prenom || '') + ' ' + (p.nom || '');
  };
  const getDoctorName = (id) => doctors.find(d => String(d.id) === String(id))?.nom || 'Unknown Doctor';

  const filteredAppointments = appointments.filter(a => 
    getPatientName(a.patient_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getDoctorName(a.doctor_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Appointment Hub</h2>
          <p className="text-sm font-medium text-slate-500">Coordinate clinical sessions and specialist availability</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-5 h-5" />} {loading ? 'Booking...' : 'Book Session'}
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-[118rem]">
        <div className="xl:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Find session by patient or provider..." 
                className="bg-slate-50 border-none rounded-2xl w-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors">Today</button>
              <button className="px-4 py-2 rounded-xl bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-colors">Upcoming</button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {filteredAppointments.map((app, i) => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-slate-50 rounded-[2rem] hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all group cursor-default"
              >
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="flex flex-col items-center justify-center h-16 w-16 bg-slate-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-primary/50">{app.appointment_date.split('-')[1]}/{app.appointment_date.split('-')[2]}</span>
                    <span className="text-lg font-black text-on-surface group-hover:text-primary transition-colors">{app.appointment_time}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black text-on-surface group-hover:text-primary transition-colors">{getPatientName(app.patient_id)}</h4>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1">
                      <Stethoscope className="w-3.5 h-3.5 text-primary" /> {getDoctorName(app.doctor_id)} • {app.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      app.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      app.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                      'bg-indigo-50 text-indigo-600'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 tracking-widest mt-1 uppercase">{app.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(app)} className="p-3 text-slate-300 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => confirmDelete(app)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors hover:bg-rose-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                    <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="py-24 text-center">
                <Calendar className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                <h3 className="text-lg font-black text-on-surface">No sessions found</h3>
                <p className="text-sm font-bold text-slate-400">Try searching for another patient or specialist.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-8">
                {editingAppointment ? 'Modify Booking' : 'Schedule New Session'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none"
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                  >
                    {patients.map(p => <option key={p.id} value={p.id}>{(p.prenom || '') + ' ' + (p.nom || '')} ({p.id})</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Specialist</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none"
                    value={formData.doctor_id}
                    onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
                  >
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                    <input 
                      required type="date" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none"
                      value={formData.appointment_date}
                      onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                    <input 
                      required type="time" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none"
                      value={formData.appointment_time}
                      onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-[63rem]">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Type</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option>Consultation</option>
                      <option>Follow-up</option>
                      <option>Surgery</option>
                      <option>Diagnostics</option>
                      <option>Therapy</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none min-h-[80px]"
                    placeholder="Add any notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase text-slate-400">Discard</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (editingAppointment ? 'Update Schedule' : 'Create Booking')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                  <Trash2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Cancel Appointment?</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Are you sure you want to cancel the appointment for <span className="font-black text-on-surface">{getPatientName(appointmentToDelete?.patient_id)}</span>?
                </p>
                
                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    Keep It
                  </button>
                  <button 
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Cancel Session'}
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

export default AppointmentManager;
