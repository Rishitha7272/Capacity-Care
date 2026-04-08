
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './LoginPage.css'

export default function LoginPage({ onLogin }) {
    const [hospital, setHospital] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const hospitals = [
        'St. Lukes Healthcare Network',
        'City General Hospital',
        'Mayo Clinic',
        'Johns Hopkins Medicine',
        'Cleveland Clinic',
        'Massachusetts General'
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Login attempt:', { hospital, email, password })
        onLogin(hospital)
    }

    return (
        <div className="ref-login-wrapper">
            <div className="ref-login-card animate-fade-in">
                {/* Abstract Logo */}
                <div className="ref-logo">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z" fill="#7a9e87" opacity="0.3" />
                        <path d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#5b8c8a" />
                        <circle cx="24" cy="24" r="4" fill="#7a9e87" />
                        <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke="#7a9e87" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                <h1 className="ref-title">Welcome to CapacityCare</h1>
                <p className="ref-subtitle">Your gateway to intelligent hospital interaction</p>

                <form className="ref-form" onSubmit={handleSubmit}>
                    <div className="ref-form-group">
                        <label>Hospital</label>
                        <select
                            value={hospital}
                            onChange={(e) => setHospital(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select hospital</option>
                            {hospitals.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>

                    <div className="ref-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="ref-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="ref-submit-btn">
                        Submit
                    </button>
                </form>

                <div className="ref-login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </div>

                <div className="ref-divider">
                    <span>or continue with</span>
                </div>

                <button className="ref-google-btn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
                    Google account
                </button>

                <div className="ref-footer">
                    By clicking "Submit", you agree to CapacityCare's <Link to="#">User Agreement</Link> and <Link to="#">Privacy Policy</Link>. We prioritize your privacy and trust, guiding you through innovative interactions while safeguarding your personal information.
                </div>
            </div>
        </div>
    )
}
