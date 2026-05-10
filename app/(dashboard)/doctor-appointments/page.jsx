'use client';

import React, { useState, useEffect } from 'react';
import DoctorAppointments from '../../../components/DoctorAppointments';
import api from '../../../services/api';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    confirmed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    date_filter: '',
    search: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await api.doctorAppointments.getAll(filters);
      setAppointments(data.appointments.data || []);
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  if (loading && appointments.length === 0) return <LoadingSpinner />;

  return (
    <DoctorAppointments 
      appointments={appointments} 
      stats={stats} 
      filters={filters} 
      setFilters={setFilters}
      refreshData={loadData}
    />
  );
}
