/**
 * ============================================
 * MINDMEET - LAYOUT COMPONENT
 * Componente de diseño principal
 * ============================================
 * 
 * @description Layout que envuelve todas las páginas autenticadas
 * @module Layout
 * @requires react
 * @requires react-router-dom
 */

import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  Home, 
  Video, 
  BarChart3, 
  FileText, 
  LogOut, 
  User,
  Moon,
  Sun
} from 'lucide-react'
import './Layout.css'

/**
 * Componente Layout principal
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {Function} props.toggleTheme - Función para cambiar tema
 * @param {string} props.theme - Tema actual ('light' | 'dark')
 * @returns {JSX.Element} Layout con navegación y contenido
 * 
 * @example
 * <Layout toggleTheme={toggleTheme} theme="light">
 *   <Dashboard />
 * </Layout>
 */
const Layout = ({ toggleTheme, theme }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Elementos de navegación del menú
   * - Cada elemento define una ruta y su apariencia
   */
  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: 'Dashboard',
      description: 'Panel Principal'
    },
    {
      path: '/recording',
      icon: Video,
      label: 'Grabación',
      description: 'Nueva Reunión'
    },
    {
      path: '/analysis',
      icon: BarChart3,
      label: 'Análisis',
      description: 'Análisis IA'
    },
    {
      path: '/documents',
      icon: FileText,
      label: 'Documentos',
      description: 'Mis Documentos'
    }
  ]

  /**
   * Verifica si una ruta está activa
   * 
   * @param {string} path - Ruta a verificar
   * @returns {boolean} True si la ruta está activa
   */
  const isActive = (path) => location.pathname === path

  /**
   * Maneja el clic en un elemento de navegación
   * 
   * @param {string} path - Ruta de destino
   */
  const handleNavClick = (path) => {
    navigate(path)
  }

  /**
   * Maneja el cierre de sesión
   */
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout()
    }
  }

  return (
    <div className="layout-container">
      {/* Header Principal */}
      <header className="layout-header">
        {/* Logo y Marca */}
        <div className="header-brand">
          <div className="brand-logo" role="img" aria-label="MindMeet Logo">
            M
          </div>
          <div className="brand-info">
            <h1 className="brand-title">MindMeet</h1>
            <p className="brand-subtitle">Inteligencia Artificial para Reuniones</p>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav className="header-nav" role="navigation" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`nav-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
                title={item.description}
              >
                <Icon size={20} />
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Acciones de Usuario */}
        <div className="header-actions">
          {/* Toggle de Tema */}
          <button
            onClick={toggleTheme}
            className="action-btn"
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            title={`Tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Perfil de Usuario */}
          <div className="user-menu">
            <button className="user-button" aria-label="Menú de usuario">
              <div className="user-avatar">
                {user?.avatar || user?.name?.charAt(0) || 'U'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Usuario'}</span>
                <span className="user-role">{user?.role || 'Miembro'}</span>
              </div>
            </button>
            
            {/* Dropdown del menú de usuario */}
            <div className="user-dropdown">
              <button className="dropdown-item" onClick={() => navigate('/profile')}>
                <User size={16} />
                <span>Mi Perfil</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="layout-content">
        <div className="content-wrapper">
          {/* Outlet renderiza el componente de la ruta actual */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="layout-footer">
        <div className="footer-content">
          <p className="footer-text">
            © 2025 MindMeet. Desarrollado para Deloitte Colombia.
          </p>
          <div className="footer-links">
            <a href="#" className="footer-link">Términos</a>
            <a href="#" className="footer-link">Privacidad</a>
            <a href="#" className="footer-link">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout