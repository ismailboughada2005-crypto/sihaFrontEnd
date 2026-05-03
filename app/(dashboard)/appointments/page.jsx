'use client';

import React, { useState, useEffect } from 'react';
import AppointmentManager from '../../../components/AppointmentManager';
import api from '../../../services/api';

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apps, pats, docs] = await Promise.all([
          api.appointments.getAll().catch(() => []),
          api.patients.getAll().catch(() => []),
          api.doctors.getAll().catch(() => [])
        ]);
        setAppointments(apps);
        setPatients(pats);
        setDoctors(docs);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return <AppointmentManager appointments={appointments} setAppointments={setAppointments} patients={patients} doctors={doctors} />;
}
