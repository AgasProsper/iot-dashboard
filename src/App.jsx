import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Dashboard from './pages/Dashboard'

// Use environment variable for production, fallback to localhost for dev
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
    const [socket, setSocket] = useState(null)
    const [connected, setConnected] = useState(false)
    const [telemetryData, setTelemetryData] = useState(null)
    const [alerts, setAlerts] = useState([])

    useEffect(() => {
        // Initialize Socket.IO connection
        const newSocket = io(SOCKET_URL, {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10
        })

        newSocket.on('connect', () => {
            console.log('✅ Connected to server')
            setConnected(true)

            // Subscribe to fleet updates (receive all boats)
            // No specific subscribe needed for fleet:update as it is broadcast
        })

        newSocket.on('disconnect', () => {
            console.log('⚠️ Disconnected from server')
            setConnected(false)
        })

        // Listen for ANY boat update
        newSocket.on('fleet:update', (data) => {
            console.log('📡 Fleet update:', data)
            setTelemetryData(data)
        })

        // Keep this for backward compatibility if backend sends direct boat updates
        newSocket.on('telemetry:update', (data) => {
            console.log('📡 Boat update:', data)
            setTelemetryData(data)
        })

        newSocket.on('alert:triggered', (alert) => {
            console.log('🚨 Alert:', alert)
            setAlerts(prev => [alert, ...prev].slice(0, 10)) // Keep last 10 alerts
        })

        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    return (
        <div className="App">
            <Dashboard
                connected={connected}
                telemetryData={telemetryData}
                alerts={alerts}
                socket={socket}
            />
        </div>
    )
}

export default App
