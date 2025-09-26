import api from "./config.js"

// Obtener carrito del usuario
export const getCart = async () => {
  try {
    console.log("🛒 Obteniendo carrito...")
    const response = await api.get("/cart")
    console.log("✅ Carrito obtenido:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al obtener carrito:", error)
    throw error.response?.data || { message: "Error al obtener carrito" }
  }
}

// Agregar producto al carrito
export const addToCart = async (productId, quantity = 1) => {
  try {
    console.log(`🛒 Agregando al carrito: ${productId} (cantidad: ${quantity})`)
    const response = await api.post("/cart/add", {
      productId,
      quantity: Number(quantity),
    })
    console.log("✅ Producto agregado al carrito:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al agregar al carrito:", error)
    throw error.response?.data || { message: "Error al agregar al carrito" }
  }
}

// Actualizar cantidad de producto en carrito
export const updateCartItem = async (productId, quantity) => {
  try {
    console.log(`🛒 Actualizando carrito: ${productId} -> cantidad: ${quantity}`)
    const response = await api.put("/cart/update", {
      productId,
      quantity: Number(quantity),
    })
    console.log("✅ Carrito actualizado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al actualizar carrito:", error)
    throw error.response?.data || { message: "Error al actualizar carrito" }
  }
}

// Remover producto del carrito
export const removeFromCart = async (productId) => {
  try {
    console.log(`🛒 Removiendo del carrito: ${productId}`)
    const response = await api.delete(`/cart/remove/${productId}`)
    console.log("✅ Producto removido del carrito:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al remover del carrito:", error)
    throw error.response?.data || { message: "Error al remover del carrito" }
  }
}

// Limpiar todo el carrito
export const clearCart = async () => {
  try {
    console.log("🛒 Limpiando carrito...")
    const response = await api.delete("/cart/clear")
    console.log("✅ Carrito limpiado:", response.data)
    return response.data
  } catch (error) {
    console.error("❌ Error al limpiar carrito:", error)
    throw error.response?.data || { message: "Error al limpiar carrito" }
  }
}

// Obtener cantidad total de items en el carrito
export const getCartItemCount = async () => {
  try {
    const cart = await getCart()
    const totalItems = cart.items?.reduce((total, item) => total + item.quantity, 0) || 0
    console.log(`🛒 Total items en carrito: ${totalItems}`)
    return totalItems
  } catch (error) {
    console.error("❌ Error al obtener cantidad del carrito:", error)
    return 0
  }
}

// Verificar si un producto está en el carrito
export const isProductInCart = async (productId) => {
  try {
    const cart = await getCart()
    const isInCart = cart.items?.some((item) => item.productId._id === productId) || false
    console.log(`🛒 Producto ${productId} en carrito: ${isInCart}`)
    return isInCart
  } catch (error) {
    console.error("❌ Error al verificar producto en carrito:", error)
    return false
  }
}
