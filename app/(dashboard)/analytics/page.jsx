'use client';

import React, { useState, useEffect } from 'react';
import AnalyticsPage from '../../../components/AnalyticsPage';
import api from '../../../services/api';

export default function AnalyticsRoute() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pats, docs, apps] = await Promise.all([
          api.patients.getAll().catch(() => []),
          api.doctors.getAll().catch(() => []),
          api.appointments.getAll().catch(() => [])
        ]);
        setPatients(pats);
        setDoctors(docs);
        setAppointments(apps);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return null;

  return <AnalyticsPage patients={patients} doctors={doctors} appointments={appointments} />;
}
