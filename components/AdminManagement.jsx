"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Lock,
  UserPlus,
  X,
} from "lucide-react";
import api from "../services/api";

const AdminManagement = ({ admins, setAdmins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    motDePasse: "",
  });

  const SENIOR_ADMIN_EMAIL = "admin@siha.com";

  React.useEffect(() => {
    api
      .getUser()
      .then((user) => setCurrentUser(user))
      .catch(() => {});
  }, []);

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        nom: admin.nom,
        email: admin.email,
        motDePasse: admin.motDePasse,
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        nom: "",
        email: "",
        motDePasse: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAdmin) {
        const updated = await api.admins.update(editingAdmin.id, formData);
        setAdmins(
          admins.map((a) =>
            a.id === editingAdmin.id ? { ...a, ...updated } : a,
          ),
        );
      } else {
        const newAdmin = await api.admins.create(formData);
        setAdmins([
          {
            ...newAdmin,
            avatar: formData.nom
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
          },
          ...admins,
        ]);
      }
      setIsModalOpen(false);
      setError(null);
    } catch (err) {
      setError("Failed to save admin: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (adminToDelete) {
      try {
        setLoading(true);
        await api.admins.delete(adminToDelete.id);
        setAdmins(admins.filter((a) => a.id !== adminToDelete.id));
        setIsDeleteModalOpen(false);
        setAdminToDelete(null);
        setError(null);
      } catch (err) {
        setError("Failed to revoke admin: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAdmins = admins.filter(
    (a) =>
      (a.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (a.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-on-surface tracking-tight">
            Admin Control Center
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Manage system administrators and security clearance
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          disabled={loading}
          className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}{" "}
          {loading ? "Processing..." : "Add New Administrator"}
        </button>
      </div>

      <div className="bg-card-bg rounded-[2.5rem] border border-card-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-card-border flex items-center justify-between bg-surface/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full bg-card-bg border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                {admins.length} Active Admins
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-card-border">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Administrator
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Contact
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Access Level
                </th>
                {filteredAdmins.some(
                  (admin) => admin.email !== SENIOR_ADMIN_EMAIL,
                ) && (
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, idx) => (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={admin.id}
                  className="group hover:bg-surface/50 transition-colors border-b last:border-none border-card-border"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center font-black text-primary text-xs shadow-sm ring-4 ring-slate-50">
                        {admin.avatar || admin.nom[0]}
                      </div>
                      <div>
                        <p className="font-black text-on-surface group-hover:text-primary transition-colors">
                          {admin.nom}
                        </p>
                        <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                          ID: {admin.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      {admin.email}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 ${
                          admin.email === SENIOR_ADMIN_EMAIL
                            ? "bg-slate-900 text-white shadow-black/10"
                            : "bg-indigo-50 text-indigo-600 shadow-indigo-100 ring-1 ring-indigo-100"
                        }`}
                      >
                        {admin.email === SENIOR_ADMIN_EMAIL ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        {admin.email === SENIOR_ADMIN_EMAIL
                          ? "System Root"
                          : "Administrator"}
                      </span>
                    </div>
                  </td>

                  {/* عرض الأزرار فقط إذا لم يكن الحساب الحالي هو الـ Senior Admin */}
                  <td className="px-8 py-6">
                    {admin.email !== SENIOR_ADMIN_EMAIL && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenModal(admin)}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setAdminToDelete(admin);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
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
              className="relative w-full max-w-lg bg-card-bg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-card-border flex justify-between items-center bg-surface/50">
                <h3 className="text-xl font-black text-on-surface tracking-tight">
                  {editingAdmin ? "Edit Administrator" : "Register New Admin"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-card-bg rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nom Complet
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Administrator General"
                    className="w-full bg-surface border border-card-border rounded-2xl py-4 px-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required
                      type="email"
                      placeholder="admin@siha.com"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 pl-14 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {editingAdmin
                      ? "New Passphrase (Optional)"
                      : "Access Passphrase"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      required={!editingAdmin}
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-surface border border-card-border rounded-2xl py-4 pl-14 pr-5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.motDePasse}
                      onChange={(e) =>
                        setFormData({ ...formData, motDePasse: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase text-slate-400 tracking-widest"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : editingAdmin ? (
                      "Update Credentials"
                    ) : (
                      "Grant Access"
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
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 sm:p-0">
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
              className="relative w-full max-w-md bg-card-bg rounded-[2.5rem] p-10 text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-on-surface mb-2">
                Revoke Clearance?
              </h3>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                You are about to remove{" "}
                <span className="font-black text-on-surface">
                  {adminToDelete?.nom}
                </span>{" "}
                from the administrator list. This will immediately revoke all
                system credentials.
              </p>
              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 bg-surface rounded-2xl text-xs font-black uppercase text-slate-400 tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    "Confirm Revoke"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
