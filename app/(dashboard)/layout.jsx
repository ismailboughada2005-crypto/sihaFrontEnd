'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, staff: 0, appointments: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        if (pathname !== '/') {
          router.push('/login');
        }
        setLoading(false);
        return;
      }
      try {
        const user = await api.getUser();
        setCurrentUser(user);
        const stats = await api.stats.getCounts().catch(() => ({}));
        setCounts({
          patients: stats.patients || 0,
          doctors: stats.doctors || 0,
          staff: stats.staff || 0,
          appointments: stats.appointments || 0
        });
      } catch (err) {
        localStorage.removeItem('auth_token');
        if (pathname !== '/') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-bold text-on-surface-variant font-sans tracking-tight">Accessing Terminal...</p>
        </div>
      </div>
    );
  }

  // If there is no authenticated user, we are on the public landing page.
  // Render children directly without the Sidebar and Navbar.
  if (!currentUser) {
    return <>{children}</>;
  }

  const activeTab = pathname.split('/').pop() || 'admin';
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar 
        userProfile={{ 
          name: currentUser?.name || 'User', 
          role: currentUser?.role || 'staff', 
        }} 
        onTabChange={(tab) => router.push(`/${tab === 'admin' ? '' : tab}`)} 
      />
      <div className="flex flex-1 relative">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => router.push(`/${tab === 'admin' ? '' : tab}`)} 
          patientCount={counts.patients} 
          doctorCount={counts.doctors} 
          staffCount={counts.staff} 
          appointmentCount={counts.appointments} 
          userRole={currentUser?.role} 
          onLogout={handleLogout} 
        />
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
 