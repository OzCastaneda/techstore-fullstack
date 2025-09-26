import api from "./config.js"

// Crear una nueva orden
export const createOrder = async (orderData) => {
  try {
    console.log("📦 Creando orden...")
    console.log("Datos de la orden:", orderData)

    const response = await api.post("/orders", orderData)
    console.log("✅ Orden creada:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al crear orden:", error)
    throw error.response?.data || { message: "Error al crear orden" }
  }
}

// Obtener todas las órdenes del usuario
export const getUserOrders = async () => {
  try {
    console.log("📦 Obteniendo órdenes del usuario...")
    const response = await api.get("/orders")
    console.log("✅ Órdenes obtenidas:", response.data)

    // Manejar diferentes formatos de respuesta
    if (Array.isArray(response.data)) {
      return response.data
    } else if (response.data.orders) {
      return response.data.orders
    } else {
      return response.data
    }
  } catch (error) {
    console.error("❌ Error al obtener órdenes:", error)
    throw error.response?.data || { message: "Error al obtener órdenes" }
  }
}

// Obtener una orden específica por ID
export const getOrderById = async (orderId) => {
  try {
    console.log(`📦 Obteniendo orden ${orderId}...`)
    const response = await api.get(`/orders/${orderId}`)
    console.log("✅ Orden obtenida:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al obtener orden:", error)
    throw error.response?.data || { message: "Error al obtener orden" }
  }
}

// Cancelar una orden
export const cancelOrder = async (orderId) => {
  try {
    console.log(`📦 Cancelando orden ${orderId}...`)
    const response = await api.put(`/orders/${orderId}/cancel`)
    console.log("✅ Orden cancelada:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al cancelar orden:", error)
    throw error.response?.data || { message: "Error al cancelar orden" }
  }
}

// Actualizar estado de orden (admin)
export const updateOrderStatus = async (orderId, status) => {
  try {
    console.log(`📦 Actualizando orden ${orderId} a estado: ${status}`)
    const response = await api.put(`/orders/${orderId}/status`, { status })
    console.log("✅ Estado de orden actualizado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al actualizar estado de orden:", error)
    throw error.response?.data || { message: "Error al actualizar estado de orden" }
  }
}

// Obtener estadísticas de órdenes (admin)
export const getOrderStats = async () => {
  try {
    console.log("📊 Obteniendo estadísticas de órdenes...")
    const response = await api.get("/orders/stats")
    console.log("✅ Estadísticas obtenidas:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error)
    throw error.response?.data || { message: "Error al obtener estadísticas" }
  }
}

