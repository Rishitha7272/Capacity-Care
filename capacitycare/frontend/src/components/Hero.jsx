import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import './Hero.css'

// Heartbeat waveform SVG path
const WAVEFORM_PATH = 'M0,40 L60,40 L80,10 L100,70 L120,15 L140,65 L160,40 L200,40 L220,40 L240,20 L260,60 L280,30 L300,40 L360,40'

function HeartbeatWave() {
    return (
        <svg className="heartbeat-svg" viewBox="0 0 360 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d={WAVEFORM_PATH}
                stroke="url(#waveGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="waveform-path"
            />
            <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="360" y2="0">
                    <stop offset="0%" stopColor="#7a9e87" stopOpacity="0" />
                    <stop offset="30%" stopColor="#7a9e87" />
                    <stop offset="70%" stopColor="#5b8c8a" />
                    <stop offset="100%" stopColor="#5b8c8a" stopOpacity="0" />
                </linearGradient>
            </defs>
        </svg>
    )
}

function MiniBarChart({ bars }) {
    return (
        <div className="mini-bar-chart">
            {bars.map((h, i) => (
                <div key={i} className="mini-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
            ))}
        </div>
    )
}

function FloatingCard({ className, children, style, delay = 0 }) {
    return (
        <div
            className={`floating-card animate-float ${className}`}
            style={{ animationDelay: `${delay}s`, ...style }}
        >
            {children}
        </div>
    )
}

function StatsTicker() {
    const stats = [
        { label: 'Active Patients', value: '4,218', trend: '+12%', color: 'sage' },
        { label: 'ICU Occupancy', value: '78.4%', trend: '-3%', color: 'teal' },
        { label: 'Staff On Duty', value: '487', trend: '+8%', color: 'clay' },
        { label: 'Satisfaction', value: '94.7%', trend: '+2%', color: 'sage' },
    ]
    return (
        <div className="stats-ticker">
            {stats.map((s, i) => (
                <div key={i} className={`ticker-item badge-${s.color}`}>
                    <span className="ticker-value">{s.value}</span>
                    <span className="ticker-label">{s.label}</span>
                    <span className={`ticker-trend ${s.trend.startsWith('+') ? 'up' : 'down'}`}>
                        {s.trend.startsWith('+') ? '↑' : '↓'} {s.trend}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default function Hero() {
    const heroRef = useRef(null)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const parallax = (factor) => ({ transform: `translateY(${scrollY * factor}px)` })

    return (
        <section className="hero" ref={heroRef} id="hero">
            {/* Background orbs */}
            <div className="glow-orb glow-sage" style={{ width: 600, height: 600, top: '-10%', right: '-5%', ...parallax(-0.05) }} />
            <div className="glow-orb glow-teal" style={{ width: 400, height: 400, bottom: '10%', left: '-8%', ...parallax(0.03) }} />
            <div className="glow-orb glow-clay" style={{ width: 300, height: 300, top: '40%', left: '30%', ...parallax(-0.02) }} />

            {/* Subtle grid bg */}
            <div className="hero-grid-bg" />

            <div className="container hero-inner">
                {/* Left: Text content */}
                <div className="hero-content" style={parallax(0.05)}>
                    <div className="badge badge-sage section-label animate-breathe">
                        <span className="badge-dot" />
                        Hospital Intelligence Platform
                    </div>

                    <h1 className="display-1 hero-headline">
                        Transform Healthcare Data into{' '}
                        <span className="gradient-text">Intelligent Insights</span>
                    </h1>

                    <p className="body-lg hero-sub">
                        Real-time analytics, descriptive insights, and smart visualization for modern hospitals — all in one unified platform.
                    </p>

                    <div className="hero-actions">
                        <Link to="/login" className="btn btn-primary btn-lg">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12 9H3m9 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Login
                        </Link>
                        <a href="#visualization" className="btn btn-secondary btn-lg">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="currentColor" />
                            </svg>
                            View Demo
                        </a>
                    </div>

                    <StatsTicker />
                </div>

                {/* Right: 3D dashboard illustration */}
                <div className="hero-visual" style={parallax(-0.04)}>
                    {/* Main dashboard panel */}
                    <div className="dashboard-panel glass-card animate-float-slow">
                        <div className="dp-header">
                            <span className="dp-title">Hospital Overview</span>
                            <span className="dp-live"><span className="live-dot" />Live</span>
                        </div>
                        <div className="dp-chart-area">
                            <HeartbeatWave />
                        </div>
                        <div className="dp-metrics">
                            <div className="dp-metric">
                                <span className="dp-m-value">142</span>
                                <span className="dp-m-label">Admissions</span>
                            </div>
                            <div className="dp-metric">
                                <span className="dp-m-value">87%</span>
                                <span className="dp-m-label">Bed Capacity</span>
                            </div>
                            <div className="dp-metric">
                                <span className="dp-m-value">14m</span>
                                <span className="dp-m-label">Avg Wait</span>
                            </div>
                        </div>
                        <MiniBarChart bars={[45, 68, 55, 80, 62, 90, 74, 58, 85, 70, 92, 78]} />
                    </div>

                    {/* Floating card 1: ICU */}
                    <FloatingCard className="fc-icu" delay={1}>
                        <div className="fc-icon fc-icon-red">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 2C5.24 2 3 4.24 3 7c0 2.21 1.34 4.1 3.26 4.76L8 14l1.74-2.24C11.66 11.1 13 9.21 13 7c0-2.76-2.24-5-5-5z" fill="#c4896a" opacity="0.3" />
                                <path d="M8 2C5.24 2 3 4.24 3 7c0 2.21 1.34 4.1 3.26 4.76L8 14l1.74-2.24C11.66 11.1 13 9.21 13 7c0-2.76-2.24-5-5-5z" stroke="#c4896a" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <div className="fc-info">
                            <span className="fc-val">87%</span>
                            <span className="fc-label">ICU Occupancy</span>
                        </div>
                        <div className="fc-sparkline">
                            <svg viewBox="0 0 60 24" fill="none">
                                <path d="M0 20 L10 16 L20 18 L30 8 L40 12 L50 6 L60 4" stroke="#c4896a" strokeWidth="2" strokeLinecap="round" fill="none" />
                            </svg>
                        </div>
                    </FloatingCard>

                    {/* Floating card 2: AI Prediction */}
                    <FloatingCard className="fc-ai" delay={2}>
                        <div className="fc-icon fc-icon-sage">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="3" fill="#7a9e87" opacity="0.4" />
                                <circle cx="8" cy="8" r="6" stroke="#7a9e87" strokeWidth="1.5" strokeDasharray="2 2" className="animate-spin-slow" />
                                <circle cx="8" cy="8" r="1.5" fill="#7a9e87" />
                            </svg>
                        </div>
                        <div className="fc-info">
                            <span className="fc-val sage">Active Alert</span>
                            <span className="fc-label">Capacity threshold met</span>
                        </div>
                    </FloatingCard>

                    {/* Floating card 3: Satisfaction */}
                    <FloatingCard className="fc-satisfaction" delay={0.5}>
                        <div className="fc-info">
                            <span className="fc-val teal">94.7%</span>
                            <span className="fc-label">Patient Satisfaction</span>
                        </div>
                        <div className="satisfaction-ring">
                            <svg viewBox="0 0 40 40" width="40" height="40">
                                <circle cx="20" cy="20" r="16" fill="none" stroke="#e8f0ea" strokeWidth="4" />
                                <circle cx="20" cy="20" r="16" fill="none" stroke="#5b8c8a" strokeWidth="4"
                                    strokeDasharray={`${94.7 * 100.53 / 100} 100.53`}
                                    strokeDashoffset="25"
                                    strokeLinecap="round"
                                    transform="rotate(-90 20 20)" />
                            </svg>
                        </div>
                    </FloatingCard>

                    {/* DNA helix abstract */}
                    <div className="dna-container animate-float" style={{ animationDelay: '1.5s' }}>
                        <svg className="dna-svg" viewBox="0 0 60 160" fill="none">
                            {Array.from({ length: 8 }, (_, i) => {
                                const y = i * 20 + 10
                                const xOffset = Math.sin(i * 0.8) * 20
                                return (
                                    <g key={i}>
                                        <circle cx={30 + xOffset} cy={y} r="4" fill="rgba(122,158,135,0.6)" />
                                        <circle cx={30 - xOffset} cy={y} r="4" fill="rgba(91,140,138,0.6)" />
                                        {i < 7 && (
                                            <>
                                                <line x1={30 + xOffset} y1={y} x2={30 - xOffset} y2={y} stroke="rgba(122,158,135,0.3)" strokeWidth="1" />
                                                <line x1={30 + xOffset} y1={y} x2={30 + Math.sin((i + 1) * 0.8) * 20} y2={y + 20} stroke="rgba(122,158,135,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                                                <line x1={30 - xOffset} y1={y} x2={30 - Math.sin((i + 1) * 0.8) * 20} y2={y + 20} stroke="rgba(91,140,138,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                                            </>
                                        )}
                                    </g>
                                )
                            })}
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bottom wave */}
            <div className="hero-wave">
                <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <path d="M0 40 C360 80 720 0 1080 40 C1260 60 1360 50 1440 40 L1440 80 L0 80 Z" fill="#fafaf7" />
                </svg>
            </div>
        </section>
    )
}
