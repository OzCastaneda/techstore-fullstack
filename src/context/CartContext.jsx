import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../api/cart';

// Crear el contexto
const CartContext = createContext();

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  // Estados del carrito
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Efecto que se ejecuta cuando cambia el estado de autenticación
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  // Función para cargar el carrito desde la API
  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.cart);
    } catch (error) {
      console.error('Error cargando carrito:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar productos al carrito
  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const response = await cartAPI.addToCart(productId, quantity);
      setCart(response.cart);
      return { success: true, message: 'Producto agregado al carrito' };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al agregar producto' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar cantidad de un producto
  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      const response = await cartAPI.updateQuantity(productId, quantity);
      setCart(response.cart);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al actualizar cantidad' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para remover producto del carrito
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await cartAPI.removeFromCart(productId);
      setCart(response.cart);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al remover producto' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar todo el carrito
  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      setCart(null);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al limpiar carrito' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares para cálculos
  const getTotalItems = () => {
    return cart?.totalItems || 0;
  };

  const getTotalPrice = () => {
    return cart?.totalPrice || 0;
  };

  // El contexto proporciona todas estas funciones a los componentes hijos
  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};