'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Users,
  Briefcase,
  ShieldCheck,
  Download,
  Mail,
  UserCheck
} from 'lucide-react';
import api from '../services/api';

const StaffDirectory = ({ staff, setStaff }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: ''
  });

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ ...member });
    } else {
      setEditingMember(null);
      setFormData({
        nom: '',
        email: '',
        motDePasse: ''
      });
    }
    setIsModalOpen(true);
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (memberToDelete) {
      try {
        setLoading(true);
        await api.secretaries.delete(memberToDelete.id);
        setStaff(staff.filter(s => s.id !== memberToDelete.id));
        setIsDeleteModalOpen(false);
        setMemberToDelete(null);
        setError(null);
      } catch (err) {
        setError('Failed to delete staff member: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingMember) {
        const updated = await api.secretaries.update(editingMember.id, formData);
        setStaff(staff.map(s => s.id === editingMember.id ? { ...updated, id: s.id } : s));
      } else {
        const newMember = await api.secretaries.create(formData);
        setStaff([{ ...newMember, avatar: formData.nom.split(' ').map(n => n[0]).join('').toUpperCase() }, ...staff]);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to save staff member: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    (s.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (s.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
          <h2 className="text-3xl font-black text-on-surface tracking-tight mb-1">Clinic Operations Staff</h2>
          <p className="text-sm font-medium text-slate-500">Manage non-clinical personnel and administrative roles</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenModal()}
            disabled={loading}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />} {loading ? 'Loading...' : 'Add Staff'}
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between gap-4">
           <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="bg-slate-50 border-none rounded-2xl w-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none font-medium h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">{filteredStaff.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Personnel</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              <AnimatePresence>
                {filteredStaff.map((member, i) => (
                  <motion.tr 
                    key={member.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center font-black text-emerald-600 text-xs shadow-sm">
                          {member.avatar || member.nom[0]}
                        </div>
                        <div>
                          <p className="font-black text-on-surface group-hover:text-emerald-600 transition-colors">{member.nom}</p>
                          <p className="text-[10px] font-bold text-slate-300 tracking-widest">ID: {member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-medium text-slate-500">{member.email}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(member)} className="p-2 text-slate-300 hover:text-emerald-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => confirmDelete(member)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Same logic as DoctorDirectory with different fields */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden">
               <h3 className="text-xl font-black text-on-surface mb-8">
                 {editingMember ? 'Update Staff Member' : 'New System Personnel'}
               </h3>
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom Complet</label>
                    <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <input required type="email" placeholder="Work Email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de Passe</label>
                    <input required type="password" placeholder="Passphrase" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-sm font-bold outline-none" value={formData.motDePasse} onChange={(e) => setFormData({...formData, motDePasse: e.target.value})} />
                  </div>
                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase text-slate-400">Cancel</button>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : (editingMember ? 'Update Member' : 'Confirm Creation')}
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
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center shadow-2xl">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500"><Trash2 className="w-10 h-10" /></div>
              <h3 className="text-2xl font-black text-on-surface mb-2">Offboard Member?</h3>
              <p className="text-sm font-medium text-slate-500">Terminating <span className="font-black text-on-surface">{memberToDelete?.nom}</span>'s record will revoke all operational clearance.</p>
                <div className="mt-10 flex gap-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-4 bg-slate-50 rounded-2xl text-xs font-black uppercase text-slate-400 tracking-widest">Cancel</button>
                <button 
                  onClick={handleDelete} 
                  disabled={loading}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Confirm Offboarding'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffDirectory;
