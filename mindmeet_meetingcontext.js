/**
 * ============================================
 * MINDMEET - MEETING CONTEXT
 * Contexto para manejo de reuniones
 * ============================================
 * 
 * @description Gestiona el estado global de reuniones y grabaciones
 * @module MeetingContext
 * @requires react
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Contexto de reuniones
 * @type {React.Context}
 */
const MeetingContext = createContext(null)

/**
 * Hook personalizado para acceder al contexto de reuniones
 * 
 * @returns {Object} Objeto con estado y funciones de reuniones
 * @throws {Error} Si se usa fuera del MeetingProvider
 * 
 * @example
 * const { meetings, startRecording, stopRecording } = useMeeting()
 */
export const useMeeting = () => {
  const context = useContext(MeetingContext)
  if (!context) {
    throw new Error('useMeeting debe ser usado dentro de un MeetingProvider')
  }
  return context
}

/**
 * Proveedor del contexto de reuniones
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 * @returns {JSX.Element} Provider con estado de reuniones
 */
export const MeetingProvider = ({ children }) => {
  // Estado de reuniones guardadas
  const [meetings, setMeetings] = useState([])
  
  // Reunión actual en grabación
  const [currentMeeting, setCurrentMeeting] = useState(null)
  
  // Estado de grabación activa
  const [isRecording, setIsRecording] = useState(false)
  
  // Timer de la reunión en segundos
  const [recordingTime, setRecordingTime] = useState(0)
  
  // Transcripción en tiempo real
  const [liveTranscript, setLiveTranscript] = useState([])
  
  // Participantes de la reunión actual
  const [participants, setParticipants] = useState([])

  /**
   * Cargar reuniones guardadas desde localStorage al iniciar
   */
  useEffect(() => {
    const savedMeetings = localStorage.getItem('mindmeet-meetings')
    if (savedMeetings) {
      try {
        const parsed = JSON.parse(savedMeetings)
        setMeetings(parsed)
        console.log(`📊 ${parsed.length} reuniones cargadas`)
      } catch (error) {
        console.error('Error al cargar reuniones:', error)
      }
    }
  }, [])

  /**
   * Guardar reuniones en localStorage cuando cambian
   */
  useEffect(() => {
    if (meetings.length > 0) {
      localStorage.setItem('mindmeet-meetings', JSON.stringify(meetings))
    }
  }, [meetings])

  /**
   * Timer para grabación activa
   */
  useEffect(() => {
    let interval = null
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (interval) clearInterval(interval)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  /**
   * Inicia una nueva grabación de reunión
   * 
   * @param {Object} config - Configuración de la reunión
   * @param {string} config.title - Título de la reunión
   * @param {Array<Object>} config.participants - Participantes iniciales
   * @returns {Object} Datos de la reunión iniciada
   * 
   * @example
   * startRecording({ 
   *   title: 'Reunión de Proyecto',
   *   participants: [{ name: 'María', avatar: 'MJ' }]
   * })
   */
  const startRecording = useCallback((config = {}) => {
    const newMeeting = {
      id: 'meeting_' + Date.now(),
      title: config.title || 'Nueva Reunión',
      startTime: new Date().toISOString(),
      status: 'recording',
      participants: config.participants || [
        { id: 1, name: 'María Jiménez', avatar: 'MJ', speaking: false },
        { id: 2, name: 'Brayan Barón', avatar: 'BB', speaking: false },
        { id: 3, name: 'José Egurrola', avatar: 'JE', speaking: false }
      ]
    }
    
    setCurrentMeeting(newMeeting)
    setIsRecording(true)
    setRecordingTime(0)
    setLiveTranscript([])
    setParticipants(newMeeting.participants)
    
    console.log('🎙️ Grabación iniciada:', newMeeting.title)
    
    return newMeeting
  }, [])

  /**
   * Pausa la grabación actual
   */
  const pauseRecording = useCallback(() => {
    setIsRecording(false)
    console.log('⏸️ Grabación pausada')
  }, [])

  /**
   * Reanuda la grabación pausada
   */
  const resumeRecording = useCallback(() => {
    setIsRecording(true)
    console.log('▶️ Grabación reanudada')
  }, [])

  /**
   * Detiene y guarda la grabación actual
   * 
   * @returns {Object} Reunión finalizada con todos los datos
   */
  const stopRecording = useCallback(() => {
    if (!currentMeeting) return null
    
    const completedMeeting = {
      ...currentMeeting,
      endTime: new Date().toISOString(),
      duration: recordingTime,
      status: 'processing',
      transcript: liveTranscript,
      createdAt: new Date().toISOString()
    }
    
    // Agregar a la lista de reuniones
    setMeetings(prev => [completedMeeting, ...prev])
    
    // Limpiar estado de grabación
    setCurrentMeeting(null)
    setIsRecording(false)
    setRecordingTime(0)
    setLiveTranscript([])
    setParticipants([])
    
    console.log('🛑 Grabación detenida:', completedMeeting.title)
    
    // Simular procesamiento de IA
    setTimeout(() => {
      updateMeetingStatus(completedMeeting.id, 'completed')
    }, 3000)
    
    return completedMeeting
  }, [currentMeeting, recordingTime, liveTranscript])

  /**
   * Agrega una línea de transcripción en tiempo real
   * 
   * @param {Object} line - Línea de transcripción
   * @param {string} line.speaker - Nombre del hablante
   * @param {string} line.text - Texto transcrito
   * @param {number} line.timestamp - Timestamp en segundos
   */
  const addTranscriptLine = useCallback((line) => {
    setLiveTranscript(prev => [...prev, {
      ...line,
      id: Date.now(),
      time: recordingTime
    }])
  }, [recordingTime])

  /**
   * Actualiza el estado de una reunión
   * 
   * @param {string} meetingId - ID de la reunión
   * @param {string} status - Nuevo estado ('recording' | 'processing' | 'completed')
   */
  const updateMeetingStatus = useCallback((meetingId, status) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, status }
        : meeting
    ))
    console.log(`📝 Reunión ${meetingId} actualizada a: ${status}`)
  }, [])

  /**
   * Obtiene una reunión por ID
   * 
   * @param {string} meetingId - ID de la reunión
   * @returns {Object|null} Reunión encontrada o null
   */
  const getMeetingById = useCallback((meetingId) => {
    return meetings.find(m => m.id === meetingId) || null
  }, [meetings])

  /**
   * Elimina una reunión
   * 
   * @param {string} meetingId - ID de la reunión a eliminar
   */
  const deleteMeeting = useCallback((meetingId) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId))
    console.log(`🗑️ Reunión ${meetingId} eliminada`)
  }, [])

  /**
   * Genera análisis de IA para una reunión
   * 
   * @param {string} meetingId - ID de la reunión
   * @returns {Promise<Object>} Análisis generado
   */
  const generateAnalysis = useCallback(async (meetingId) => {
    console.log(`🤖 Generando análisis para reunión ${meetingId}`)
    
    // Simular procesamiento de IA
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const analysis = {
      mindMap: {
        centralTopic: 'Proyecto MindMeet',
        nodes: [
          { id: 1, label: 'Transcripción IA', position: { x: 20, y: 20 } },
          { id: 2, label: 'Mapas Mentales', position: { x: 80, y: 20 } },
          { id: 3, label: 'Integraciones', position: { x: 20, y: 80 } },
          { id: 4, label: 'Demo Deloitte', position: { x: 80, y: 80 } }
        ]
      },
      summary: 'Reunión sobre el progreso del proyecto MindMeet para Deloitte Colombia.',
      keyPoints: [
        'Módulo de transcripción completado con 94% de precisión',
        'Algoritmo de mapas mentales funcionando correctamente',
        'Preparación de demo para cliente'
      ],
      actionItems: [
        { task: 'Finalizar integraciones', assignee: 'Brayan', deadline: '2025-03-25' },
        { task: 'Preparar presentación', assignee: 'María', deadline: '2025-03-24' }
      ]
    }
    
    // Actualizar reunión con análisis
    setMeetings(prev => prev.map(meeting =>
      meeting.id === meetingId
        ? { ...meeting, analysis }
        : meeting
    ))
    
    console.log('✅ Análisis completado')
    return analysis
  }, [])

  /**
   * Formatea el tiempo de grabación
   * 
   * @param {number} seconds - Segundos de grabación
   * @returns {string} Tiempo formateado MM:SS
   */
  const formatRecordingTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  /**
   * Simula actividad de participantes
   */
  useEffect(() => {
    if (!isRecording || participants.length === 0) return
    
    const interval = setInterval(() => {
      // Activar aleatoriamente un participante como hablando
      setParticipants(prev => prev.map(p => ({
        ...p,
        speaking: Math.random() > 0.7
      })))
    }, 3000)
    
    return () => clearInterval(interval)
  }, [isRecording, participants])

  // Estadísticas de reuniones
  const stats = {
    total: meetings.length,
    thisMonth: meetings.filter(m => {
      const meetingDate = new Date(m.createdAt)
      const now = new Date()
      return meetingDate.getMonth() === now.getMonth() && 
             meetingDate.getFullYear() === now.getFullYear()
    }).length,
    completed: meetings.filter(m => m.status === 'completed').length,
    totalDuration: meetings.reduce((acc, m) => acc + (m.duration || 0), 0)
  }

  // Valor del contexto
  const value = {
    // Estado
    meetings,
    currentMeeting,
    isRecording,
    recordingTime,
    liveTranscript,
    participants,
    stats,
    
    // Funciones
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    addTranscriptLine,
    updateMeetingStatus,
    getMeetingById,
    deleteMeeting,
    generateAnalysis,
    formatRecordingTime
  }

  return (
    <MeetingContext.Provider value={value}>
      {children}
    </MeetingContext.Provider>
  )
}