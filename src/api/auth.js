import api from "./config.js"

// Registrar usuario
export const registerUser = async (userData) => {
  try {
    console.log("📝 Registrando usuario:", userData.email)
    const response = await api.post("/auth/register", userData)

    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      console.log("✅ Usuario registrado y guardado:", response.data.user)
    }

    return response.data
  } catch (error) {
    console.error("❌ Error en registro:", error)
    throw error.response?.data || { message: "Error de conexión" }
  }
}

// Login usuario
export const loginUser = async (credentials) => {
  try {
    console.log("🔐 Iniciando sesión:", credentials.email)
    const response = await api.post("/auth/login", credentials)

    if (response.data.success) {
      // Guardar token y usuario en localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      console.log("✅ Usuario logueado y guardado:", response.data.user)
    }

    return response.data
  } catch (error) {
    console.error("❌ Error en login:", error)
    throw error.response?.data || { message: "Error de conexión" }
  }
}

// Logout usuario
export const logoutUser = () => {
  console.log("👋 Cerrando sesión...")
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Verificar si está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  return !!(token && user)
}

// Obtener usuario actual
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    // Si hay error al parsear, limpiar datos corruptos
    logoutUser()
    return null
  }
}

// Obtener token actual
export const getToken = () => {
  return localStorage.getItem("token")
}

// Verificar si el token es válido (opcional - para verificaciones adicionales)
export const verifyToken = async () => {
  try {
    const response = await api.get("/auth/verify")
    return response.data
  } catch (error) {
    console.error("Token inválido:", error)
    logoutUser()
    return { valid: false }
  }
}
     