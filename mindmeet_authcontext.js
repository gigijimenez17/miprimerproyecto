/**
 * ============================================
 * MINDMEET - AUTH CONTEXT
 * Contexto para manejo de autenticación
 * ============================================
 * 
 * @description Provee estado y funciones de autenticación globalmente
 * @module AuthContext
 * @requires react
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Contexto de autenticación
 * @type {React.Context}
 */
const AuthContext = createContext(null)

/**
 * Hook personalizado para acceder al contexto de autenticación
 * 
 * @returns {Object} Objeto con estado y funciones de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 * 
 * @example
 * const { user, login, logout } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

/**
 * Proveedor del contexto de autenticación
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Provider con estado de autenticación
 */
export const AuthProvider = ({ children }) => {
  // Estado del usuario actual
  const [user, setUser] = useState(null)
  
  // Estado de carga durante operaciones de autenticación
  const [loading, setLoading] = useState(true)
  
  // Estado de carga durante login/registro
  const [isAuthLoading, setIsAuthLoading] = useState(false)
  
  const navigate = useNavigate()

  /**
   * Efecto para verificar sesión existente al cargar la app
   * - Verifica localStorage para sesión persistente
   * - Restaura datos del usuario si existe sesión válida
   */
  useEffect(() => {
    // Simular verificación de sesión
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('mindmeet-user')
        const savedToken = localStorage.getItem('mindmeet-token')
        
        if (savedUser && savedToken) {
          // Verificar si el token es válido
          const userData = JSON.parse(savedUser)
          setUser(userData)
          console.log('✅ Sesión restaurada:', userData.name)
        }
      } catch (error) {
        console.error('❌ Error al verificar autenticación:', error)
        // Limpiar datos corruptos
        localStorage.removeItem('mindmeet-user')
        localStorage.removeItem('mindmeet-token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Función de inicio de sesión
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Promesa con resultado del login
   * 
   * @example
   * await login('user@example.com', 'password123')
   */
  const login = async (email, password) => {
    setIsAuthLoading(true)
    
    try {
      // Simular llamada a API (reemplazar con API real)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Datos simulados del usuario (reemplazar con respuesta de API)
      const userData = {
        id: 'user_' + Date.now(),
        name: 'María Jiménez',
        email: email,
        avatar: 'MJ',
        role: 'admin'
      }
      
      const token = 'token_' + Date.now() // Token simulado
      
      // Guardar en estado y localStorage
      setUser(userData)
      localStorage.setItem('mindmeet-user', JSON.stringify(userData))
      localStorage.setItem('mindmeet-token', token)
      
      console.log('✅ Login exitoso:', userData.name)
      
      // Navegar al dashboard
      navigate('/dashboard')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Error en login:', error)
      return { 
        success: false, 
        error: 'Credenciales inválidas. Por favor intenta de nuevo.' 
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  /**
   * Función de registro de usuario
   * 
   * @param {Object} data - Datos del nuevo usuario
   * @param {string} data.name - Nombre completo
   * @param {string} data.email - Email
   * @param {string} data.password - Contraseña
   * @returns {Promise<Object>} Promesa con resultado del registro
   * 
   * @example
   * await register({ name: 'Juan', email: 'juan@email.com', password: 'pass123' })
   */
  const register = async (data) => {
    setIsAuthLoading(true)
    
    try {
      // Simular llamada a API de registro
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Crear usuario nuevo
      const userData = {
        id: 'user_' + Date.now(),
        name: data.name,
        email: data.email,
        avatar: data.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        role: 'user'
      }
      
      const token = 'token_' + Date.now()
      
      // Guardar en estado y localStorage
      setUser(userData)
      localStorage.setItem('mindmeet-user', JSON.stringify(userData))
      localStorage.setItem('mindmeet-token', token)
      
      console.log('✅ Registro exitoso:', userData.name)
      
      // Navegar al dashboard
      navigate('/dashboard')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ Error en registro:', error)
      return { 
        success: false, 
        error: 'Error al crear la cuenta. Por favor intenta de nuevo.' 
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  /**
   * Función de cierre de sesión
   * - Limpia estado del usuario
   * - Elimina datos de localStorage
   * - Redirige a login
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem('mindmeet-user')
    localStorage.removeItem('mindmeet-token')
    console.log('👋 Sesión cerrada')
    navigate('/login')
  }

  /**
   * Función para recuperación de contraseña
   * 
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Promesa con resultado
   */
  const forgotPassword = async (email) => {
    setIsAuthLoading(true)
    
    try {
      // Simular envío de email de recuperación
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('📧 Email de recuperación enviado a:', email)
      
      return { 
        success: true, 
        message: 'Se ha enviado un enlace de recuperación a tu correo' 
      }
    } catch (error) {
      console.error('❌ Error en recuperación:', error)
      return { 
        success: false, 
        error: 'Error al enviar el email. Por favor intenta de nuevo.' 
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  /**
   * Función de login con redes sociales
   * 
   * @param {string} provider - Proveedor ('google' | 'github')
   * @returns {Promise<Object>} Promesa con resultado
   */
  const socialLogin = async (provider) => {
    setIsAuthLoading(true)
    
    try {
      // Simular OAuth (reemplazar con implementación real)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const userData = {
        id: 'user_' + Date.now(),
        name: 'Usuario ' + provider,
        email: `user@${provider}.com`,
        avatar: provider === 'google' ? 'UG' : 'UGH',
        role: 'user',
        provider: provider
      }
      
      const token = 'token_' + Date.now()
      
      setUser(userData)
      localStorage.setItem('mindmeet-user', JSON.stringify(userData))
      localStorage.setItem('mindmeet-token', token)
      
      console.log(`✅ Login con ${provider} exitoso`)
      
      navigate('/dashboard')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error(`❌ Error en login con ${provider}:`, error)
      return { 
        success: false, 
        error: `Error al iniciar sesión con ${provider}` 
      }
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Valor del contexto
  const value = {
    user,
    loading,
    isAuthLoading,
    login,
    register,
    logout,
    forgotPassword,
    socialLogin,
    isAuthenticated: !!user
  }

  // No renderizar children hasta verificar autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}