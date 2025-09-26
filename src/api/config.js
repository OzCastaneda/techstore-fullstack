import axios from "axios"

// Configuración base de axios
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("❌ Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
    console.error("Error data:", error.response?.data)

    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.log("🔒 Token inválido, limpiando sesión...")
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Solo redirigir si no estamos ya en login/register
      const currentPath = window.location.pathname
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

export default api
