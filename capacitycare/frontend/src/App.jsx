import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
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
    const [hospitalName, setHospitalName] = useState('')

    const handleLogin = (hospital) => {
        setIsLoggedIn(true)
        setHospitalName(hospital)
    }

    const handleLogout = () => {
        setIsLoggedIn(false)
        setHospitalName('')
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Dashboard />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <CostAnalysis />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <PatientFlow />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <ResourceUtilization />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <DiseaseTrends />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Settings />
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
                                    hospitalName={hospitalName}
                                    onLogout={handleLogout}
                                />
                                <main className="app-main">
                                    <Profile />
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
