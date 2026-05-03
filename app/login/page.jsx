'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '../../components/LoginPage';

export default function LoginRoute() {
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to home which will then redirect to the correct dashboard based on role
    router.push('/');
  };

  return <LoginPage onLogin={handleLogin} />;
}
