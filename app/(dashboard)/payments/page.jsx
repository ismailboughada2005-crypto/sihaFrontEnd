'use client';

import React, { useState, useEffect } from 'react';
import PaymentManagement from '../../../components/PaymentManagement';
import api from '../../../services/api';

export default function PaymentsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.patients.getAll()
      .then(res => setPatients(res))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return <PaymentManagement patients={patients} />;
}
