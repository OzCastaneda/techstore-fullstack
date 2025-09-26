"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser, logoutUser, getCurrentUser, isAuthenticated } from "../api/auth.js"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser()
          setUser(currentUser)
          console.log("👤 Usuario autenticado:", currentUser)
        }
      } catch (error) {
        console.error("Error al inicializar auth:", error)
        // Limpiar datos corruptos
        logoutUser()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔐 Intentando login...")

      const response = await loginUser(credentials)

      if (response.success) {
        setUser(response.user)
        console.log("✅ Login exitoso:", response.user)
        return { success: true, user: response.user }
      } else {
        throw new Error(response.message || "Error en el login")
      }
    } catch (err) {
      console.error("❌ Error en login:", err)
      const errorMessage = err.message || "Error al iniciar sesión"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      setError(null)
      console.log("📝 Intentando registro...")

      const response = await registerUser(userData)

      if (response.success) {
        setUser(response.user)
        console.log("✅ Registro exitoso:", response.user)
        return { success: true, user: response.user }
      } else {
        throw new Error(response.message || "Error en el registro")
      }
    } catch (err) {
      console.error("❌ Error en registro:", err)
      const errorMessage = err.message || "Error al registrarse"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    setError(null)
    console.log("👋 Usuario desconectado")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }
  return context
}
