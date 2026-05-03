'use client';

import React, { useState, useEffect } from 'react';
import PatientDirectory from '../../../components/PatientDirectory';
import api from '../../../services/api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.patients.getAll()
      .then(res => setPatients(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center pt-32">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <PatientDirectory patients={patients} setPatients={setPatients} />;
}
