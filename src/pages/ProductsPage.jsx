"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../api/products.js"
import { addToCart, getCartItemCount } from "../api/cart.js"
import { useAuth } from "../context/AuthContext.jsx"

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState({})
  const [cartItemCount, setCartItemCount] = useState(0)
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    sortBy: "name",
    priceRange: "all",
  })
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchProducts()
    if (isAuthenticated) {
      fetchCartItemCount()
    }
  }, [isAuthenticated])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔄 Cargando productos...")

      const response = await getProducts()
      console.log("✅ Productos recibidos:", response)

      // Manejar diferentes formatos de respuesta
      const productsData = response.products || response || []
      setProducts(Array.isArray(productsData) ? productsData : [])
    } catch (err) {
      console.error("❌ Error al cargar productos:", err)
      setError(err.message || "Error al cargar los productos")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCartItemCount = async () => {
    try {
      const count = await getCartItemCount()
      setCartItemCount(count)
    } catch (error) {
      console.error("Error al obtener cantidad del carrito:", error)
    }
  }

  const handleAddToCart = async (productId, productName) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }))
      console.log(`🛒 Agregando ${productName} al carrito...`)

      await addToCart(productId, 1)

      // Actualizar contador del carrito
      await fetchCartItemCount()

      // Mostrar mensaje de éxito
      showSuccessMessage(`✅ ${productName} agregado al carrito`)
    } catch (error) {
      console.error("❌ Error al agregar al carrito:", error)
      showErrorMessage(error.message || "Error al agregar el producto al carrito")
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const showSuccessMessage = (message) => {
    // Crear notificación temporal
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
    // Crear notificación de error temporal
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

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesSearch = !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase())

    let matchesPrice = true
    if (filters.priceRange !== "all") {
      const price = product.price
      switch (filters.priceRange) {
        case "under-100":
          matchesPrice = price < 100
          break
        case "100-500":
          matchesPrice = price >= 100 && price <= 500
          break
        case "500-1000":
          matchesPrice = price >= 500 && price <= 1000
          break
        case "over-1000":
          matchesPrice = price > 1000
          break
      }
    }

    return matchesCategory && matchesSearch && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const categories = [...new Set(products.map((product) => product.category))]

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      sortBy: "name",
      priceRange: "all",
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Productos</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Error al cargar los productos</h3>
          <p className="mt-2">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-gray-600">Descubre nuestra amplia selección</p>
        </div>
        {isAuthenticated && (
          <Link
            to="/cart"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors relative"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
            <span>Carrito</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rango de precio</label>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los precios</option>
              <option value="under-100">Menos de $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="over-1000">Más de $1000</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nombre</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Calificación</option>
              <option value="newest">Más Recientes</option>
            </select>
          </div>
        </div>

        {(filters.search || filters.category || filters.priceRange !== "all" || filters.sortBy !== "name") && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-gray-600">Filtros activos</span>
            <button onClick={clearFilters} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Resultados */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="w-24 h-24 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">
              Mostrando {sortedProducts.length} de {products.length} productos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg?height=200&width=300&query=tech product"}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "/modern-tech-product.png"
                    }}
                  />
                  {product.featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐ Destacado
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                    <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.numReviews || 0})
                      </span>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => handleAddToCart(product._id, product.name)}
                      disabled={addingToCart[product._id] || product.stock === 0}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {addingToCart[product._id] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Agregando...</span>
                        </>
                      ) : product.stock === 0 ? (
                        <span>Sin Stock</span>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l1.5 1.5M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z"
                            />
                          </svg>
                          <span>Agregar al carrito</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="block w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors text-center"
                    >
                      Iniciar sesión para comprar
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ProductsPage
