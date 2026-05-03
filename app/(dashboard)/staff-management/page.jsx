'use client';

import React, { useState, useEffect } from 'react';
import StaffDirectory from '../../../components/StaffDirectory';
import api from '../../../services/api';

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.secretaries.getAll()
      .then(res => setStaff(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <StaffDirectory staff={staff} setStaff={setStaff} />;
}
