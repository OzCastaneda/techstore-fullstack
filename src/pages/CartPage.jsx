"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { getCart, updateCartItem, removeFromCart, clearCart } from "../api/cart.js"

const CartPage = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    fetchCart()
  }, [isAuthenticated, navigate])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error("Error al cargar carrito:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating(true)
      const updatedCart = await updateCartItem(productId, newQuantity)
      setCart(updatedCart)
    } catch (error) {
      console.error("Error al actualizar cantidad:", error)
      alert("Error al actualizar la cantidad")
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (productId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    try {
      setUpdating(true)
      const updatedCart = await removeFromCart(productId)
      setCart(updatedCart)
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      alert("Error al eliminar el producto")
    } finally {
      setUpdating(false)
    }
  }

  const handleClearCart = async () => {
    if (!confirm("¿Estás seguro de que quieres vaciar el carrito?")) return

    try {
      setUpdating(true)
      const clearedCart = await clearCart()
      setCart(clearedCart)
    } catch (error) {
      console.error("Error al vaciar carrito:", error)
      alert("Error al vaciar el carrito")
    } finally {
      setUpdating(false)
    }
  }

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => {
      return total + item.productId.price * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mi Carrito</h1>
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">¡Agrega algunos productos para comenzar!</p>
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mi Carrito</h1>
        <button
          onClick={handleClearCart}
          disabled={updating}
          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
        >
          Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items del carrito */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.productId.image || "/placeholder.svg"}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                    <p className="text-gray-600">${item.productId.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId._id, item.quantity - 1)}
                      disabled={updating || item.quantity <= 1}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId._id, item.quantity + 1)}
                      disabled={updating}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${(item.productId.price * item.quantity).toFixed(2)}</p>
                    <button
                      onClick={() => handleRemoveItem(item.productId._id)}
                      disabled={updating}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>{calculateTotal() > 100 ? "Gratis" : "$10.00"}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${(calculateTotal() + (calculateTotal() > 100 ? 0 : 10)).toFixed(2)}</span>
              </div>
            </div>
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
              onClick={() => alert("Funcionalidad de checkout próximamente")}
            >
              Proceder al Pago
            </button>
            <Link to="/products" className="block text-center text-blue-600 hover:text-blue-800 mt-4">
              ← Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
