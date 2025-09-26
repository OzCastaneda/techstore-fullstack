"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { getUserOrders, cancelOrder } from "../api/orders.js"

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingOrder, setCancellingOrder] = useState(null)
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    fetchOrders()
  }, [isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("📦 Cargando órdenes...")

      const ordersData = await getUserOrders()
      console.log("✅ Órdenes cargadas:", ordersData)

      // Asegurar que ordersData sea un array
      const ordersArray = Array.isArray(ordersData) ? ordersData : []
      setOrders(ordersArray)
    } catch (err) {
      console.error("❌ Error al cargar pedidos:", err)
      setError(err.message || "Error al cargar los pedidos")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId, orderNumber) => {
    if (!confirm(`¿Estás seguro de que quieres cancelar el pedido #${orderNumber}?`)) {
      return
    }

    try {
      setCancellingOrder(orderId)
      await cancelOrder(orderId)

      // Actualizar la lista de órdenes
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, status: "cancelled" } : order)))

      showSuccessMessage("Pedido cancelado exitosamente")
    } catch (error) {
      console.error("Error al cancelar pedido:", error)
      showErrorMessage(error.message || "Error al cancelar el pedido")
    } finally {
      setCancellingOrder(null)
    }
  }

  const showSuccessMessage = (message) => {
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  const showErrorMessage = (message) => {
    const notification = document.createElement("div")
    notification.className =
      "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.opacity = "0"
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 3000)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusText = (status) => {
    const texts = {
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      processing: "🔄",
      shipped: "🚚",
      delivered: "✅",
      cancelled: "❌",
    }
    return icons[status] || "📦"
  }

  const canCancelOrder = (order) => {
    return order.status === "pending" || order.status === "processing"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tus pedidos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Error al cargar los pedidos</h3>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
        <div className="text-center">
          <Link
            to="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
        <div className="text-center py-12">
          <div className="mb-6">
            <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No tienes pedidos aún</h2>
          <p className="text-gray-500 mb-8">¡Haz tu primera compra y aparecerá aquí!</p>
          <div className="space-x-4">
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Productos
            </Link>
            <Link
              to="/cart"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ver Carrito
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mis Pedidos</h1>
          <p className="text-gray-600">Hola {user?.name}, aquí están tus pedidos</p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/products"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Seguir Comprando
          </Link>
          <Link
            to="/cart"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Ver Carrito
          </Link>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
          <div className="text-sm text-gray-600">Total Pedidos</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {orders.filter((order) => order.status === "delivered").length}
          </div>
          <div className="text-sm text-gray-600">Entregados</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter((order) => order.status === "pending" || order.status === "processing").length}
          </div>
          <div className="text-sm text-gray-600">En Proceso</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            ${orders.reduce((total, order) => total + (order.totalAmount || 0), 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">Total Gastado</div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del pedido */}
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span>Pedido #{order._id.slice(-8)}</span>
                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                  </h3>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt || order.orderDate)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="text-lg font-semibold">${(order.totalAmount || 0).toFixed(2)}</span>
                  {canCancelOrder(order) && (
                    <button
                      onClick={() => handleCancelOrder(order._id, order._id.slice(-8))}
                      disabled={cancellingOrder === order._id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                    >
                      {cancellingOrder === order._id ? "Cancelando..." : "Cancelar"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Items del pedido */}
            <div className="px-6 py-4">
              <div className="space-y-3">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg?height=60&width=60&query=product"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/modern-tech-product.png"
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                )) || <p className="text-gray-500 italic">No hay items en este pedido</p>}
              </div>
            </div>

            {/* Información de envío */}
            {order.shippingAddress && (
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Dirección de Envío</h4>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Método de Pago</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {order.paymentMethod?.replace("_", " ") || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrdersPage
