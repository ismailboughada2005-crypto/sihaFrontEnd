'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '../../components/AdminDashboard';
import DoctorDashboard from '../../components/DoctorDashboard';
import StaffDashboard from '../../components/StaffDashboard';
import LandingPage from '../../components/LandingPage';
import api from '../../services/api';

export default function HomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [data, setData] = useState({ patients: [], doctors: [], appointments: [], staff: [] });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [patientsRes, doctorsRes, appointmentsRes, staffRes] = await Promise.all([
        api.patients.getAll().catch(() => []),
        api.doctors.getAll().catch(() => []),
        api.appointments.getAll().catch(() => []),
        api.secretaries.getAll().catch(() => [])
      ]);
      setData({ patients: patientsRes, doctors: doctorsRes, appointments: appointmentsRes, staff: staffRes });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const user = await api.getUser();
        setCurrentUser(user);
        await loadData();
      } catch (err) {
        console.error('Failed to initialize homepage', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return null;

  if (!currentUser) {
    return <LandingPage />;
  }

  switch (currentUser?.role) {
    case 'admin':
      return (
        <AdminDashboard 
          patients={data.patients} 
          doctors={data.doctors} 
          staff={data.staff} 
          appointments={data.appointments} 
          onTabChange={(tab) => router.push(`/${tab}`)} 
        />
      );
    case 'doctor':
      return <DoctorDashboard />;
    case 'staff':
      return (
        <StaffDashboard 
          patients={data.patients} 
          doctors={data.doctors} 
          appointments={data.appointments} 
          refreshData={loadData} 
        />
      );
    default:
      return <div className="p-8 text-center text-red-500 font-bold">Access Denied</div>;
  }
}
 