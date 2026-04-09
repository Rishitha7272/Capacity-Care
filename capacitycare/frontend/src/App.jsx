import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import CostAnalysis from './pages/CostAnalysis'
import PatientFlow from './pages/PatientFlow'
import ResourceUtilization from './pages/ResourceUtilization'
import DiseaseTrends from './pages/DiseaseTrends'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import LandingPage from './pages/LandingPage'
import './App.css'

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing session on load
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('capacitycare_token')
            if (token) {
                try {
                    const response = await fetch('http://localhost:5001/api/auth/verify', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                    const data = await response.json()
                    if (response.ok) {
                        setIsLoggedIn(true)
                        setUser(data.user)
                    } else {
                        localStorage.removeItem('capacitycare_token')
                    }
                } catch (err) {
                    console.error('Auth verification failed', err)
                }
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [])

    const handleLogin = (userData, token) => {
        localStorage.setItem('capacitycare_token', token)
        setIsLoggedIn(true)
        setUser(userData)
    }

    const handleLogout = () => {
        localStorage.removeItem('capacitycare_token')
        setIsLoggedIn(false)
        setUser(null)
    }

    if (isLoading) {
        return (
            <div className="app-loading">
                <div className="loader"></div>
                <p>Establishing Secure Connection...</p>
            </div>
        )
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <LoginPage onLogin={handleLogin} />
                        )
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Dashboard user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/cost-analysis"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <CostAnalysis user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/patient-flow"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <PatientFlow user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/resource-utilization"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <ResourceUtilization user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/disease-trends"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <DiseaseTrends user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/settings"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Settings user={user} onLogout={handleLogout} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <div className="app-layout">
                                <Sidebar
                                    user={user}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Profile user={user} />
                                </main>
                            </div>
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </Router>
    )
}
