import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Cargar datos del usuario
  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error cargando usuario:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Función de login
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el login' 
      };
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error en el registro' 
      };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};