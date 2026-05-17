'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  User,
  X,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import api from '../services/api';

const PatientDirectory = ({ patients, setPatients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dob: '',
    gender: 'Male',
    dept: 'Cardiology',
    status: 'Active',
    email: '',
    phone: ''
  });

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setFormData({
        nom: patient.nom || '',
        prenom: patient.prenom || '',
        dob: patient.dob || '',
        gender: patient.gender || 'Male',
        dept: patient.dept || 'Cardiology',
        status: patient.status || 'Active',
        email: patient.email || '',
        phone: patient.phone || ''
      });
    } else {
      setEditingPatient(null);
      setFormData({
        nom: '',
        prenom: '',
        dob: '',
        gender: 'Male',
        dept: 'Cardiology',
        status: 'Active',
        email: '',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const confirmDelete = (patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (patientToDelete) {
      try {
        setLoading(true);
        await api.patients.delete(patientToDelete.id);
        setPatients(patients.filter(p => p.id !== patientToDelete.id));
        setIsDeleteModalOpen(false);
        setPatientToDelete(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete patient: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingPatient) {
        const updated = await api.patients.update(editingPatient.id, formData);
        setPatients(patients.map(p => p.id === editingPatient.id ? { ...updated, id: p.id } : p));
      } else {
        const newPatient = await api.patients.create(formData);
        setPatients([{ ...newPatient, avatar: (formData.prenom[0] || '') + (formData.nom[0] || '').toUpperCase() }, ...patients]);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to save patient: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.prenom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    String(p.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.dept?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Patient Directory</h2>
          <p className="text-sm font-medium text-slate-500">Manage clinical records and admission history</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenModal()}
            disabled={loading}
            className="px-5 py-2.5 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />} {loading ? 'Loading...' : 'Add Patient'}
          </button>
        </div>
      </header>

      <div className="bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden transition-all duration-500">
        <div className="p-8 border-b border-card-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/20 dark:bg-slate-800/20">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, ID or department..." 
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
              {filteredPatients.length} Records Found
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Demographics</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
                {filteredPatients.map((patient, i) => (
                  <motion.tr 
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary text-sm shadow-sm ring-4 ring-card-border">
                          {patient.avatar || (patient.prenom?.[0] || '') + (patient.nom?.[0] || '')}
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface group-hover:text-primary transition-colors">{patient.prenom} {patient.nom}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{patient.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-on-surface-variant capitalize">{patient.gender}, {patient.dob ? (new Date().getFullYear() - new Date(patient.dob).getFullYear()) : '?'}y</span>
                        <span className="text-[10px] text-slate-400 font-medium">{patient.email || 'No email registered'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-tight">{patient.dept}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                          patient.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-900/50' :
                          patient.status === 'Waiting' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-amber-100 dark:ring-amber-900/50' :
                          'bg-slate-50 dark:bg-slate-800 text-slate-400 ring-slate-100 dark:ring-slate-700'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(patient)}
                          className="p-2.5 bg-card-bg border border-card-border rounded-xl text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(patient)}
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
          {filteredPatients.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
                <User className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-on-surface">No Patients Found</h3>
              <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm mx-auto">Try adjusting your search filters or add a new patient to the system.</p>
              <button 
                onClick={() => handleOpenModal()}
                className="mt-8 px-6 py-3 bg-primary text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
              >
                Create New Record
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Backdrop */}
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
              className="relative w-full max-w-xl bg-card-bg rounded-[2.5rem] shadow-2xl overflow-hidden border border-card-border transition-all duration-500"
            >
              <div className="p-8 border-b border-card-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/10">
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tight">
                    {editingPatient ? 'Update Patient Record' : 'New Admission'}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Clinical Identification</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl bg-card-bg shadow-sm border border-card-border hover:bg-item-hover transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Johnathan"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none text-on-surface"
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. Smith"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date de Naissance</label>
                    <input 
                      required
                      type="date" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      value={formData.dob}
                      onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.dept}
                      onChange={(e) => setFormData({...formData, dept: e.target.value})}
                    >
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Pediatrics</option>
                      <option>Dermatology</option>
                      <option>Physiotherapy</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Admission Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option>Active</option>
                      <option>Waiting</option>
                      <option>Billing</option>
                      <option>Post-Op</option>
                    </select>
                  </div>

                  <div className="col-span-2 space-y-2 pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Contact Information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        type="email" 
                        placeholder="Email Address"
                        className="bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        className="bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-xs font-bold outline-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      editingPatient ? 'Save Record' : 'Confirm Admission'
                    )}
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
                <h3 className="text-2xl font-black text-on-surface tracking-tight mb-2">Delete Patient Record?</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Are you sure you want to delete <span className="font-black text-on-surface">{patientToDelete?.prenom} {patientToDelete?.nom}</span>'s record? This action cannot be undone.
                </p>
                
                <div className="mt-10 flex gap-4">
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Delete Now'
                    )}
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

export default PatientDirectory;
