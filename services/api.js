import Cookies from 'js-cookie';

// 1. حيد الـ /api من الدومين الرئيسي وخليها تزيد أوتوماتيكياً
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_BASE_URL = `${BASE_URL.replace(/\/$/, '')}/api`; 
// الـ replace كتحيد أي / زائدة فـ الآخر باش ما يتوبلش السطر

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return token ? { ...headers, 'Authorization': `Bearer ${token}` } : headers;
};

const handleResponse = async (response) => {
  const text = await response.text();
  let data = null;
  
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON response:', text);
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }
  
  return data;
};

export const api = {
  // 2. تأكدنا أن الـ endpoint ديما كيبدا بـ /
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async put(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async patch(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // باقي الـ Endpoints (patients, doctors, admins...) غادي يبقاو كيفما هما بالظبط بلا تغيير

  // Secretaries
  secretaries: {
    getAll: () => api.get('/secretaires'),
    getOne: (id) => api.get(`/secretaires/${id}`),
    create: (data) => api.post('/secretaires', data),
    update: (id, data) => api.put(`/secretaires/${id}`, data),
    delete: (id) => api.delete(`/secretaires/${id}`),
  },

  // Administrators
  admins: {
    getAll: () => api.get('/administrateurs'),
    getOne: (id) => api.get(`/administrateurs/${id}`),
    create: (data) => api.post('/administrateurs', data),
    update: (id, data) => api.put(`/administrateurs/${id}`, data),
    delete: (id) => api.delete(`/administrateurs/${id}`),
  },
  
  // Appointments
  appointments: {
    getAll: () => api.get('/appointments'),
    getOne: (id) => api.get(`/appointments/${id}`),
    create: (data) => api.post('/appointments', data),
    update: (id, data) => api.put(`/appointments/${id}`, data),
    delete: (id) => api.delete(`/appointments/${id}`),
  },

  // Auth
  login: (credentials) => api.post('/login', credentials),
  logout: async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.warn('Server logout failed or already unauthenticated', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      Cookies.remove('auth_token');
      Cookies.remove('user_role');
    }
  },
  getUser: () => api.get('/user'),

  // Stats
  stats: {
    getCounts: () => api.get('/stats/counts'),
  },

  // ─── Payments Module ──────────────────────────────────────────────────────
  invoices: {
    getAll:        (params = '') => api.get(`/invoices${params}`),
    getOne:        (id)          => api.get(`/invoices/${id}`),
    create:        (data)        => api.post('/invoices', data),
    update:        (id, data)    => api.patch(`/invoices/${id}`, data),
    delete:        (id)          => api.delete(`/invoices/${id}`),
    patientHistory:(patientId)   => api.get(`/patients/${patientId}/invoices`),
  },

  payments: {
    getAll:  (params = '') => api.get(`/payments${params}`),
    getOne:  (id)          => api.get(`/payments/${id}`),
    create:  (data)        => api.post('/payments', data),
    update:  (id, data)    => api.patch(`/payments/${id}`, data),
    delete:  (id)          => api.delete(`/payments/${id}`),
    receipt: (id)          => api.get(`/payments/${id}/receipt`),
  },

  reports: {
    dashboard:      () => api.get('/reports/dashboard'),
    monthlyRevenue: (year) => api.get(`/reports/monthly-revenue?year=${year}`),
    dailyRevenue:   (from, to) => api.get(`/reports/daily-revenue?from=${from}&to=${to}`),
    paymentMethods: () => api.get('/reports/payment-methods'),
    topPatients:    () => api.get('/reports/top-patients'),
  },

  // Doctor Appointments
  doctorAppointments: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`/doctor/appointments?${query}`);
    },
    confirm: (id) => api.patch(`/doctor/appointments/${id}/confirm`),
    cancel: (id, reason) => api.patch(`/doctor/appointments/${id}/cancel`, { cancellation_reason: reason }),
    complete: (id, notes) => api.patch(`/doctor/appointments/${id}/complete`, { notes }),
  },
};

export default api;
