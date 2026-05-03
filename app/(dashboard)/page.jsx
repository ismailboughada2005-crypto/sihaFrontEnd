'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';
import DoctorDashboard from '../../components/DoctorDashboard';
import StaffDashboard from '../../components/StaffDashboard';
import api from '../../services/api';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({ patients: [], doctors: [], appointments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await api.getUser();
        setCurrentUser(user);

        // Fetch dashboard data
        const [patientsRes, doctorsRes, appointmentsRes, staffRes] = await Promise.all([
          api.patients.getAll().catch(() => []),
          api.doctors.getAll().catch(() => []),
          api.appointments.getAll().catch(() => []),
          api.secretaries.getAll().catch(() => [])
        ]);

        setData({
          patients: patientsRes,
          doctors: doctorsRes,
          appointments: appointmentsRes,
          staff: staffRes
        });
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return null;

  switch (currentUser?.role) {
    case 'admin':
      return <AdminDashboard patients={data.patients} doctors={data.doctors} staff={data.staff} appointments={data.appointments} onTabChange={(tab) => router.push(`/${tab}`)} />;
    case 'doctor':
      return <DoctorDashboard patients={data.patients} />;
    case 'staff':
      return <StaffDashboard patients={data.patients} />;
    default:
      return <div>Access Denied</div>;
  }
}
