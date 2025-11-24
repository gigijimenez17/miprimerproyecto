/**
 * ============================================
 * MINDMEET - APP.JSX
 * Componente principal de la aplicación
 * ============================================
 * 
 * @description Componente raíz que gestiona el estado global y las rutas
 * @module App
 * @requires react
 * @requires react-router-dom
 */

import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Recording from './pages/Recording/Recording'
import Analysis from './pages/Analysis/Analysis'
import Documents from './pages/Documents/Documents'
import { AuthProvider } from './context/AuthContext'
import { MeetingProvider } from './context/MeetingContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import './App.css'

/**
 * Componente principal de la aplicación
 * 
 * @component
 * @returns {JSX.Element} Aplicación completa con sistema de rutas
 * 
 * @example
 * // Uso interno en main.jsx
 * <App />
 */
function App() {
  // Estado para controlar el tema de la aplicación
  const [theme, setTheme] = useState('light')

  /**
   * Efecto para cargar preferencias del usuario al iniciar
   * - Carga tema guardado en localStorage
   * - Aplica configuraciones iniciales
   */
  useEffect(() => {
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('mindmeet-theme')
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }

    // Log de inicialización
    console.log('✅ MindMeet App inicializado')
  }, [])

  /**
   * Alterna entre tema claro y oscuro
   */
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('mindmeet-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <AuthProvider>
      <MeetingProvider>
        <div className="app" data-theme={theme}>
          <Routes>
            {/* Ruta pública - Login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas - Requieren autenticación */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout toggleTheme={toggleTheme} theme={theme} />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recording" element={<Recording />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/documents" element={<Documents />} />
              </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Ruta 404 - Página no encontrada */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </MeetingProvider>
    </AuthProvider>
  )
}

export default App