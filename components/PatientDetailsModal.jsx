import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Activity,
  CheckCircle2,
  XCircle,
  Building
} from 'lucide-react';
import api from '../services/api';

const PatientDetailsModal = ({ isOpen, onClose, patientId }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && patientId) {
      setLoading(true);
      api.patients.getOne(patientId)
        .then(data => {
          setPatient(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch patient details:", err);
          setLoading(false);
        });
    } else {
      setPatient(null);
    }
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card-bg w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-card-border overflow-hidden my-8"
        >
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
            </div>
          ) : patient ? (
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Column - Patient Info */}
              <div className="w-full md:w-1/3 bg-surface p-8 border-r border-card-border">
                <div className="flex justify-between items-start mb-8 md:hidden">
                  <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase">Patient File</h3>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:text-on-surface-variant rounded-xl hover:bg-card-bg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                  <div className="h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center font-black text-primary text-3xl shadow-sm ring-4 ring-card-border mb-4">
                    {(patient.prenom?.[0] || '') + (patient.nom?.[0] || '')}
                  </div>
                  <h2 className="text-xl font-black text-on-surface">{patient.prenom} {patient.nom}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {patient.id}</p>
                  <span className="mt-3 px-3 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">
                    {patient.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Demographics</p>
                    <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{patient.gender}, {patient.dob ? (new Date().getFullYear() - new Date(patient.dob).getFullYear()) : '?'} years old</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>DOB: {patient.dob || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>Dept: {patient.dept || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Contact</p>
                    <div className="space-y-3 text-sm font-medium text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{patient.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="truncate" title={patient.email}>{patient.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{patient.adresse || patient.address || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">System</p>
                    <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                      <Activity className="w-4 h-4 text-slate-400" />
                      <span>Registered: {new Date(patient.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Appointments */}
              <div className="w-full md:w-2/3 p-8 flex flex-col max-h-[80vh] overflow-hidden">
                <div className="hidden md:flex justify-between items-start mb-8 shrink-0">
                  <div>
                    <h3 className="text-2xl font-black text-on-surface tracking-tight uppercase">Medical History</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Appointments & Visits</p>
                  </div>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:text-on-surface-variant rounded-xl hover:bg-surface transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {patient.appointments && patient.appointments.length > 0 ? (
                    patient.appointments.map((app, i) => (
                      <div key={app.id} className="p-5 border border-card-border rounded-2xl bg-surface/50 hover:bg-surface transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${
                              app.status === 'completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                              app.status === 'pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' :
                              app.status === 'confirmed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' :
                              'bg-rose-50 text-rose-600 dark:bg-rose-900/30'
                            }`}>
                              {app.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                               app.status === 'cancelled' ? <XCircle className="w-5 h-5" /> :
                               <Clock className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-on-surface">
                                {app.doctor ? `Dr. ${app.doctor.prenom || ''} ${app.doctor.nom}` : 'Unassigned Doctor'}
                              </p>
                              <p className="text-xs font-bold text-on-surface-variant">{app.type || 'Consultation'}</p>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ring-1 ${
                            app.status === 'completed' ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            app.status === 'pending' ? 'bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-900/30 dark:text-amber-400' :
                            app.status === 'confirmed' ? 'bg-blue-50 text-blue-600 ring-blue-500/20 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-rose-50 text-rose-600 ring-rose-500/20 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 bg-card-bg rounded-xl p-3 border border-card-border">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(app.appointment_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {app.appointment_time}
                          </div>
                          {app.notes && (
                            <div className="w-full mt-2 pt-2 border-t border-card-border text-on-surface-variant font-medium">
                              "{app.notes}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-surface border border-card-border rounded-2xl flex items-center justify-center mb-4">
                        <Calendar className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-sm font-black text-on-surface uppercase tracking-widest">No Appointments Found</p>
                      <p className="text-xs text-on-surface-variant font-medium mt-2 max-w-[200px]">This patient has not scheduled any visits yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm font-black text-rose-500 uppercase tracking-widest">Failed to load patient profile</p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PatientDetailsModal;
