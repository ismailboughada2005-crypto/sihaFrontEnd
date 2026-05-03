'use client';

import React, { useState, useEffect } from 'react';
import DoctorDirectory from '../../../components/DoctorDirectory';
import api from '../../../services/api';

import LoadingSpinner from '../../../components/LoadingSpinner';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.doctors.getAll()
      .then(res => setDoctors(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return <DoctorDirectory doctors={doctors} setDoctors={setDoctors} />;
}
