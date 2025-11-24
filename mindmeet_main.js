/**
 * ============================================
 * MINDMEET - MAIN.JSX
 * Punto de entrada principal de la aplicación
 * ============================================
 * 
 * @description Archivo principal que inicializa React y ReactDOM
 * @module Main
 * @requires react
 * @requires react-dom
 * @requires react-router-dom
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Configuración de desarrollo para debugging
if (import.meta.env.DEV) {
  console.log('🚀 MindMeet iniciando en modo desarrollo...')
}

/**
 * Renderiza la aplicación principal
 * - BrowserRouter: Proporciona navegación entre rutas
 * - StrictMode: Activa verificaciones adicionales en desarrollo
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)