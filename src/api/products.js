import api from './config';

export const productsAPI = {
  // Obtener todos los productos con filtros opcionales
  getProducts: async (params = {}) => {
    // Construir query string con parámetros
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    
    const response = await api.get(url);
    return response.data;
  },

  // Obtener un producto por ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Crear producto (solo admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Actualizar producto (solo admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // Eliminar producto (solo admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
// Exportar para uso en otros módulos
export default productsAPI;

