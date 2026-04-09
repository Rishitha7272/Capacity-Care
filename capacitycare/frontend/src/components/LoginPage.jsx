import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, User, Activity, ArrowRight, CheckCircle2 } from 'lucide-react'
import './LoginPage.css'
import loginVisual from '../assets/login-visual.png'

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`http://localhost:5001/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Authorization denied. Please check your clinical credentials.')
            }

            console.log('Login successful:', data)
            onLogin(data.user, data.token)
        } catch (err) {
            console.error('Auth error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page-wrapper">
            <div className="login-split-container">
                {/* Left Side: Information & Branding */}
                <div className="login-visual-panel">
                    <div className="visual-overlay"></div>
                    <img src={loginVisual} alt="Clinical Environment" className="visual-bg" />
                    
                    <div className="visual-content animate-fade-in">
                        <div className="brand-badge">
                            <Activity size={24} className="badge-icon" />
                            <span>CapacityCare Enterprise</span>
                        </div>
                        
                        <div className="hero-text">
                            <h1>Precision Analytics for Modern Healthcare.</h1>
                            <p>Optimizing hospital capacity and clinical workflows through data-driven intelligence.</p>
                        </div>

                        <div className="feature-highlights">
                            <div className="feature-item">
                                <CheckCircle2 size={18} className="feat-icon" />
                                <span>Real-time Bed Capacity Monitoring</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={18} className="feat-icon" />
                                <span>Predictive Patient Flow Analytics</span>
                            </div>
                            <div className="feature-item">
                                <CheckCircle2 size={18} className="feat-icon" />
                                <span>Secure Institutional Governance</span>
                            </div>
                        </div>
                    </div>
                    
                    <footer className="visual-footer">
                        <p>© 2026 CapacityCare Systems. All Rights Reserved.</p>
                    </footer>
                </div>

                {/* Right Side: Login Form */}
                <div className="login-form-panel">
                    <div className="form-container animate-slide-in-right">
                        <header className="form-header">
                            <h2 className="welcome-text">Clinical Authentication</h2>
                            <p className="subtitle-text">Enter your institutional credentials to access the command hub.</p>
                        </header>

                        <form className="login-form-content" onSubmit={handleSubmit}>
                            {error && (
                                <div className="login-error-alert">
                                    <ShieldCheck size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="input-field-group">
                                <label htmlFor="email">Identity Protocol</label>
                                <div className="input-wrapper">
                                    <User className="field-icon" size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="clinician@capacitycare.org"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-field-group">
                                <label htmlFor="password">Security Identifier</label>
                                <div className="input-wrapper">
                                    <Lock className="field-icon" size={20} />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <Link to="#" className="forgot-password">Security Assistance?</Link>
                            </div>

                            <button type="submit" className="login-submit-btn" disabled={loading}>
                                {loading ? (
                                    <div className="btn-loading">
                                        <div className="spinner"></div>
                                        <span>Verifying Credentials...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Authorize Access</span>
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <footer className="form-footer">
                            <div className="compliance-notice">
                                <p>By authenticating, you adhere to the Hospital Information Security Policy.</p>
                            </div>
                            <div className="legal-links">
                                <Link to="#">Terms of Service</Link>
                                <span className="separator">•</span>
                                <Link to="#">Privacy Policy</Link>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    )
}
