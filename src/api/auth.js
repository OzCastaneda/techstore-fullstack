import api from './config';

export const authAPI = {
  // Registrar usuario
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login de usuario
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};