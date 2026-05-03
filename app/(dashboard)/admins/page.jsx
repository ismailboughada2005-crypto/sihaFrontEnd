'use client';

import React, { useState, useEffect } from 'react';
import AdminManagement from '../../../components/AdminManagement';
import api from '../../../services/api';

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admins.getAll()
      .then(res => setAdmins(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <AdminManagement admins={admins} setAdmins={setAdmins} />;
}
