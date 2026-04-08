import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import './CtaSection.css'

export default function CtaSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('cta-visible') },
            { threshold: 0.2 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="cta-section" id="cta" ref={sectionRef}>
            {/* Glow orbs */}
            <div className="glow-orb glow-sage" style={{ width: 500, height: 500, top: '-20%', left: '-10%' }} />
            <div className="glow-orb glow-teal" style={{ width: 400, height: 400, bottom: '-20%', right: '-10%' }} />
            <div className="glow-orb glow-clay" style={{ width: 300, height: 300, top: '30%', right: '20%', opacity: 0.6 }} />

            <div className="container cta-inner">
                <div className="cta-content">

                    <h2 className="display-1 cta-headline">
                        Start optimizing your hospital{' '}
                        <span className="gradient-text">today</span>
                    </h2>

                    <p className="body-lg cta-sub">
                        Join 200+ healthcare organizations that have transformed their data into their most powerful clinical asset. Deploy in 48 hours.
                    </p>

                    <div className="cta-actions">
                        <Link to="/login" className="btn btn-primary btn-lg cta-btn-main">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M12 9H3m9 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Login
                        </Link>
                        <a href="#features" className="btn btn-secondary btn-lg">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="currentColor" />
                            </svg>
                            Schedule Demo
                        </a>
                    </div>

                    <div className="cta-trust">
                        {['SOC 2 Compliant', 'HIPAA Ready', '99.9% Uptime SLA', 'FHIR Integration'].map((t, i) => (
                            <div key={i} className="cta-trust-item">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1L8.3 4.5H12L9.3 6.7L10.4 10.2L7 8L3.6 10.2L4.7 6.7L2 4.5H5.7Z" fill="#7a9e87" opacity="0.7" />
                                </svg>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Mini dashboard preview */}
                <div className="cta-visual">
                    <div className="cta-card glass-card animate-float-slow">
                        <div className="cta-card-header">
                            <span className="cta-card-title">Quick Setup</span>
                            <span className="badge badge-sage" style={{ fontSize: '0.7rem' }}>Live</span>
                        </div>
                        <div className="cta-steps">
                            {[
                                { num: 1, label: 'Connect your EHR system', done: true },
                                { num: 2, label: 'Configure dashboards', done: true },
                                { num: 3, label: 'Invite your team', done: false, active: true },
                                { num: 4, label: 'Go live', done: false },
                            ].map(s => (
                                <div key={s.num} className={`cta-step ${s.done ? 'done' : ''} ${s.active ? 'active' : ''}`}>
                                    <div className="cta-step-num">
                                        {s.done ? (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : s.num}
                                    </div>
                                    <span className="cta-step-label">{s.label}</span>
                                    {s.active && <span className="badge badge-teal" style={{ fontSize: '0.65rem', marginLeft: 'auto' }}>Now</span>}
                                </div>
                            ))}
                        </div>
                        <div className="cta-progress">
                            <div className="cta-progress-label">
                                <span>Setup Progress</span>
                                <span className="color-sage">50%</span>
                            </div>
                            <div className="cta-progress-bar">
                                <div className="cta-progress-fill" style={{ width: '50%' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
