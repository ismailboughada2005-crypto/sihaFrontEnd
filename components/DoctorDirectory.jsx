'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  User,
  Stethoscope,
  Filter,
  Download,
  Mail,
  Phone
} from 'lucide-react';
import api from '../services/api';

const DoctorDirectory = ({ doctors, setDoctors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    specialite: 'General Medicine',
    email: '',
    motDePasse: '',
    status: 'Active'
  });

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({ ...doctor });
    } else {
      setEditingDoctor(null);
      setFormData({
        nom: '',
        specialite: 'General Medicine',
        email: '',
        motDePasse: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const confirmDelete = (doctor) => {
    setDoctorToDelete(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (doctorToDelete) {
      try {
        setLoading(true);
        await api.doctors.delete(doctorToDelete.id);
        setDoctors(doctors.filter(d => d.id !== doctorToDelete.id));
        setIsDeleteModalOpen(false);
        setDoctorToDelete(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete doctor: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingDoctor) {
        const updated = await api.doctors.update(editingDoctor.id, formData);
        setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...updated, id: d.id } : d));
      } else {
        const newDoctor = await api.doctors.create(formData);
        setDoctors([{ ...newDoctor, avatar: formData.nom.split(' ').map(n => n[0]).join('').toUpperCase() }, ...doctors]);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to save doctor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(d => 
    (d.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.specialite?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Medical Staff</h2>
          <p className="text-sm font-medium text-on-surface-variant">Manage physician credentials and department assignments</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />} {loading ? 'Loading...' : 'Add Doctor'}
          </button>
        </div>
      </header>

      <div className="bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by name or specialty..." 
              className="bg-surface border-none rounded-2xl w-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
            {filteredDoctors.length} Doctors Registered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-8">
          <AnimatePresence>
            {filteredDoctors.map((doctor, i) => (
              <motion.div 
                key={doctor.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card-bg border border-card-border rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl shadow-inner uppercase">
                      {doctor.avatar || doctor.nom[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${doctor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenModal(doctor)} className="p-2 text-slate-300 hover:text-primary transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(doctor)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-on-surface line-clamp-1">{doctor.nom}</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-0.5">{doctor.specialite}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-medium truncate">{doctor.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-card-border flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {doctor.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="py-24 text-center">
            <div className="inline-flex p-6 bg-surface rounded-full mb-6">
              <Stethoscope className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-on-surface">No Specialists Found</h3>
            <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm mx-auto">Try a different search or register a new practitioner.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-card-bg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-card-border flex justify-between items-center bg-surface/50">
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tight">
                    {editingDoctor ? 'Update Physician Profile' : 'New Doctor Registration'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Credential Management</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-card-bg shadow-sm border border-card-border">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom Complet</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Dr. Sarah Mitchell"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Spécialité</label>
                    <select 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none appearance-none"
                      value={formData.specialite}
                      onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                    >
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Pediatrics</option>
                      <option>Surgery</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Professionnel</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                   <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de Passe</label>
                    <input 
                      required
                      type="password" 
                      placeholder="Security Credentials"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none"
                      value={formData.motDePasse}
                      onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (editingDoctor ? 'Save Doctor' : 'Register Doctor')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-card-bg rounded-[2.5rem] p-10 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500"><Trash2 className="w-10 h-10" /></div>
              <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Remove Specialist?</h3>
              <p className="text-sm font-medium text-on-surface-variant">Deleting <span className="font-black text-on-surface">{doctorToDelete?.nom}</span> will clear all their scheduled rounds and records.</p>
                <div className="mt-10 flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400">Wait, No</button>
                <button 
                  onClick={handleDelete} 
                  disabled={loading}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Confirm Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDirectory;
