/**
 * ============================================
 * MINDMEET - LOGIN PAGE
 * Página de autenticación
 * ============================================
 * 
 * @description Página con login, registro y recuperación de contraseña
 * @module LoginPage
 * @requires react
 */

import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, User, Github, Chrome, ArrowLeft, CheckCircle } from 'lucide-react'
import './Login.css'

/**
 * Componente de página de Login
 * 
 * @component
 * @returns {JSX.Element} Página de autenticación completa
 */
const Login = () => {
  const { login, register, forgotPassword, socialLogin, isAuthLoading } = useAuth()
  
  // Estado para controlar la vista activa
  const [view, setView] = useState('login') // 'login' | 'register' | 'forgot' | 'success'
  
  // Estado para formularios
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({})

  /**
   * Maneja cambios en los campos del formulario
   * 
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Valida el email
   * 
   * @param {string} email - Email a validar
   * @returns {boolean} True si es válido
   */
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  /**
   * Valida el formulario según la vista actual
   * 
   * @returns {boolean} True si el formulario es válido
   */
  const validateForm = () => {
    const newErrors = {}
    
    // Validación de email (todos los formularios)
    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresa un correo válido'
    }
    
    if (view === 'login') {
      // Validación para login
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
      }
    } else if (view === 'register') {
      // Validación para registro
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'El nombre debe tener al menos 2 caracteres'
      }
      
      if (!formData.password) {
        newErrors.password = 'La contraseña es requerida'
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Maneja el envío del formulario de login
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await login(formData.email, formData.password)
    
    if (!result.success) {
      setErrors({ general: result.error })
    }
  }

  /**
   * Maneja el envío del formulario de registro
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    
    if (!result.success) {
      setErrors({ general: result.error })
    }
  }

  /**
   * Maneja el envío del formulario de recuperación
   * 
   * @param {Event} e - Evento del formulario
   */
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!formData.email) {
      setErrors({ email: 'El correo electrónico es requerido' })
      return
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Por favor ingresa un correo válido' })
      return
    }
    
    const result = await forgotPassword(formData.email)
    
    if (result.success) {
      setView('success')
    } else {
      setErrors({ general: result.error })
    }
  }

  /**
   * Maneja login con redes sociales
   * 
   * @param {string} provider - Proveedor ('google' | 'github')
   */
  const handleSocialLogin = async (provider) => {
    await socialLogin(provider)
  }

  /**
   * Cambia de vista y limpia el formulario
   * 
   * @param {string} newView - Nueva vista a mostrar
   */
  const changeView = (newView) => {
    setView(newView)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Tarjeta de Autenticación */}
        <div className="auth-card">
          {/* Vista de Login */}
          {view === 'login' && (
            <div className="auth-view active">
              {/* Header */}
              <div className="auth-header">
                <div className="auth-logo">M</div>
                <h2 className="auth-title">¡Bienvenido de vuelta!</h2>
                <p className="auth-subtitle">Inicia sesión para acceder a tu cuenta</p>
              </div>

              {/* Navegación entre Login/Registro */}
              <div className="auth-nav">
                <button className="auth-nav-btn active">
                  Iniciar Sesión
                </button>
                <button 
                  className="auth-nav-btn"
                  onClick={() => changeView('register')}
                >
                  Crear Cuenta
                </button>
              </div>

              {/* Formulario de Login */}
              <form className="auth-form" onsubmit={handleLogin}>
                {/* Error General */}
                {errors.general && (
                  <div className="error-banner">
                    {errors.general}
                  </div>
                )}

                {/* Campo de Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Correo Electrónico
                  </label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                {/* Campo de Contraseña */}
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                {/* Botón de Submit */}
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              {/* Divider */}
              <div className="divider">
                <span>o continúa con</span>
              </div>

              {/* Botones de Redes Sociales */}
              <div className="social-buttons">
                <button 
                  className="social-btn google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isAuthLoading}
                >
                  <Chrome size={20} />
                  <span>Google</span>
                </button>
                <button 
                  className="social-btn github"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isAuthLoading}
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </button>
              </div>

              {/* Link de Recuperación */}
              <div className="auth-links">
                <button 
                  className="auth-link"
                  onClick={() => changeView('forgot')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
          )}

          {/* Vista de Registro */}
          {view === 'register' && (
            <div className="auth-view active">
              <div className="auth-header">
                <div className="auth-logo">M</div>
                <h2 className="auth-title">Crear nueva cuenta</h2>
                <p className="auth-subtitle">Únete a MindMeet y transforma tus reuniones</p>
              </div>

              <div className="auth-nav">
                <button 
                  className="auth-nav-btn"
                  onClick={() => changeView('login')}
                >
                  Iniciar Sesión
                </button>
                <button className="auth-nav-btn active">
                  Crear Cuenta
                </button>
              </div>

              <form className="auth-form" onSubmit={handleRegister}>
                {errors.general && (
                  <div className="error-banner">{errors.general}</div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    Nombre completo
                  </label>
                  <div className="input-wrapper">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-email">
                    Correo Electrónico
                  </label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      id="register-email"
                      name="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="register-password">
                    Contraseña
                  </label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      id="register-password"
                      name="password"
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirmPassword">
                    Confirmar Contraseña
                  </label>
                  <div className="input-wrapper">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </form>

              <div className="divider">
                <span>o regístrate con</span>
              </div>

              <div className="social-buttons">
                <button 
                  className="social-btn google"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isAuthLoading}
                >
                  <Chrome size={20} />
                  <span>Google</span>
                </button>
                <button 
                  className="social-btn github"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isAuthLoading}
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Vista de Recuperación de Contraseña */}
          {view === 'forgot' && (
            <div className="auth-view active">
              <div className="auth-header">
                <div className="auth-logo">M</div>
                <h2 className="auth-title">Recuperar contraseña</h2>
                <p className="auth-subtitle">
                  Te enviaremos un enlace para restablecer tu contraseña
                </p>
              </div>

              <form className="auth-form" onSubmit={handleForgotPassword}>
                {errors.general && (
                  <div className="error-banner">{errors.general}</div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="forgot-email">
                    Correo Electrónico
                  </label>
                  <div className="input-wrapper">
                    <Mail size={20} className="input-icon" />
                    <input
                      type="email"
                      id="forgot-email"
                      name="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isAuthLoading}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isAuthLoading}
                >
                  {isAuthLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                </button>
              </form>

              <div className="auth-links">
                <button 
                  className="auth-link"
                  onClick={() => changeView('login')}
                >
                  <ArrowLeft size={16} />
                  <span>Volver al inicio de sesión</span>
                </button>
              </div>
            </div>
          )}

          {/* Vista de Éxito */}
          {view === 'success' && (
            <div className="auth-view active">
              <div className="success-card">
                <div className="success-icon">
                  <CheckCircle size={64} />
                </div>
                <h2 className="auth-title">¡Enlace enviado!</h2>
                <p className="auth-subtitle">
                  Revisa tu correo electrónico y sigue las instrucciones para 
                  restablecer tu contraseña.
                </p>
                
                <button 
                  className="btn btn-secondary"
                  onClick={() => changeView('login')}
                  style={{ marginTop: '20px' }}
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login