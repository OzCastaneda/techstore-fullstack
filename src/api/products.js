import api from "./config.js"

// Obtener todos los productos
export const getProducts = async (params = {}) => {
  try {
    console.log("🔄 Obteniendo productos...")
    const response = await api.get("/products", { params })
    console.log("✅ Productos obtenidos:", response.data)

    // Manejar diferentes formatos de respuesta del backend
    if (response.data.success) {
      return response.data // { success: true, products: [...] }
    } else if (Array.isArray(response.data)) {
      return { products: response.data } // Formato directo de array
    } else {
      return response.data // Formato directo del objeto
    }
  } catch (error) {
    console.error("❌ Error al obtener productos:", error)
    console.error("Error response:", error.response?.data)
    throw error.response?.data || { message: "Error al obtener productos" }
  }
}

// Obtener producto por ID
export const getProductById = async (id) => {
  try {
    console.log(`🔄 Obteniendo producto ${id}...`)
    const response = await api.get(`/products/${id}`)
    console.log("✅ Producto obtenido:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al obtener producto:", error)
    throw error.response?.data || { message: "Error al obtener producto" }
  }
}

// Crear producto (admin)
export const createProduct = async (productData) => {
  try {
    console.log("🔄 Creando producto...")
    const response = await api.post("/products", productData)
    console.log("✅ Producto creado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al crear producto:", error)
    throw error.response?.data || { message: "Error al crear producto" }
  }
}

// Actualizar producto (admin)
export const updateProduct = async (id, productData) => {
  try {
    console.log(`🔄 Actualizando producto ${id}...`)
    const response = await api.put(`/products/${id}`, productData)
    console.log("✅ Producto actualizado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error)
    throw error.response?.data || { message: "Error al actualizar producto" }
  }
}

// Eliminar producto (admin)
export const deleteProduct = async (id) => {
  try {
    console.log(`🔄 Eliminando producto ${id}...`)
    const response = await api.delete(`/products/${id}`)
    console.log("✅ Producto eliminado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error)
    throw error.response?.data || { message: "Error al eliminar producto" }
  }
}

// Obtener productos destacados
export const getFeaturedProducts = async () => {
  try {
    console.log("🔄 Obteniendo productos destacados...")
    const response = await getProducts()
    const products = response.products || response || []
    const featured = products.filter((product) => product.featured)
    console.log("✅ Productos destacados obtenidos:", featured.length)
    return featured
  } catch (error) {
    console.error("❌ Error al obtener productos destacados:", error)
    throw error
  }
}

