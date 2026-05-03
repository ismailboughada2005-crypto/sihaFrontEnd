const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

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
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Generic requests
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

  // Patients
  patients: {
    getAll: () => api.get('/patients'),
    getOne: (id) => api.get(`/patients/${id}`),
    create: (data) => api.post('/patients', data),
    update: (id, data) => api.put(`/patients/${id}`, data),
    delete: (id) => api.delete(`/patients/${id}`),
  },

  // Doctors (Medecins)
  doctors: {
    getAll: () => api.get('/medecins'),
    getOne: (id) => api.get(`/medecins/${id}`),
    create: (data) => api.post('/medecins', data),
    update: (id, data) => api.put(`/medecins/${id}`, data),
    delete: (id) => api.delete(`/medecins/${id}`),
  },

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
    }
  },
  getUser: () => api.get('/user'),

  // Stats
  stats: {
    getCounts: () => api.get('/stats/counts'),
  },
};

export default api;
