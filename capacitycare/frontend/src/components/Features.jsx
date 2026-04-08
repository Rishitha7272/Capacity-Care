import { useEffect, useRef } from 'react'
import './Features.css'

const features = [
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="10" width="22" height="15" rx="3" fill="rgba(122,158,135,0.15)" stroke="#7a9e87" strokeWidth="1.5" />
                <path d="M3 14h22" stroke="#7a9e87" strokeWidth="1" opacity="0.5" />
                <circle cx="14" cy="6" r="3" fill="rgba(122,158,135,0.3)" stroke="#7a9e87" strokeWidth="1.5" />
                <path d="M8 19h4M16 19h4M8 22h2M16 22h2" stroke="#7a9e87" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        color: 'sage',
        badge: 'Real-Time',
        title: 'Smart Patient Monitoring',
        description: 'Continuous vital tracking with intelligent alerts. Detect anomalies before they become critical events with AI-powered pattern recognition.',
        stats: [{ label: 'Response Time', value: '-65%' }, { label: 'Alert Accuracy', value: '99.2%' }],
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="4" width="24" height="20" rx="4" fill="rgba(91,140,138,0.15)" stroke="#5b8c8a" strokeWidth="1.5" />
                <path d="M6 14 L10 10 L14 16 L18 8 L22 12" stroke="#5b8c8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="22" cy="12" r="2" fill="#5b8c8a" />
            </svg>
        ),
        color: 'teal',
        badge: 'Live',
        title: 'Real-time ICU Dashboard',
        description: 'Complete visibility into ICU capacity, bed availability, and staff deployment. One screen, total situational awareness.',
        stats: [{ label: 'Beds Tracked', value: '500+' }, { label: 'Data Latency', value: '<2s' }],
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="11" fill="rgba(196,137,106,0.12)" stroke="#c4896a" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="7" fill="rgba(196,137,106,0.1)" stroke="#c4896a" strokeWidth="1" strokeDasharray="2 2" />
                <circle cx="14" cy="14" r="3" fill="#c4896a" opacity="0.6" />
                <path d="M14 3v3M14 22v3M3 14h3M22 14h3" stroke="#c4896a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
        ),
        color: 'clay',
        badge: 'AI-Powered',
        title: 'Descriptive Analytics',
        description: 'Understand historical trends and current performance with rich, interactive visualizations that reveal hidden operational patterns.',
        stats: [{ label: 'Forecast Accuracy', value: '94%' }, { label: 'Forward Window', value: '72h' }],
    },
    {
        icon: (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="3" fill="rgba(122,158,135,0.15)" stroke="#7a9e87" strokeWidth="1.5" />
                <rect x="15" y="3" width="10" height="10" rx="3" fill="rgba(91,140,138,0.15)" stroke="#5b8c8a" strokeWidth="1.5" />
                <rect x="3" y="15" width="10" height="10" rx="3" fill="rgba(91,140,138,0.15)" stroke="#5b8c8a" strokeWidth="1.5" />
                <rect x="15" y="15" width="10" height="10" rx="3" fill="rgba(122,158,135,0.15)" stroke="#7a9e87" strokeWidth="1.5" />
            </svg>
        ),
        color: 'sage',
        badge: 'Smart',
        title: 'Resource Optimization',
        description: 'Intelligent allocation of beds, staff, and equipment. Reduce waste while improving patient outcomes and staff wellbeing.',
        stats: [{ label: 'Cost Savings', value: '23%' }, { label: 'Utilization', value: '+31%' }],
    },
]

function FeatureCard({ feature, index }) {
    const cardRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                }
            },
            { threshold: 0.15 }
        )
        if (cardRef.current) observer.observe(cardRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div
            ref={cardRef}
            className={`feature-card card fade-up fade-up-delay-${index + 1}`}
        >
            <div className={`feature-icon-wrap feature-icon-${feature.color}`}>
                {feature.icon}
            </div>
            <div className={`feature-badge badge badge-${feature.color}`}>
                {feature.badge}
            </div>
            <h3 className="h3 feature-title">{feature.title}</h3>
            <p className="body-sm feature-desc">{feature.description}</p>
            <div className="feature-stats">
                {feature.stats.map((s, i) => (
                    <div key={i} className="feature-stat">
                        <span className={`fstat-val color-${feature.color}`}>{s.value}</span>
                        <span className="fstat-label">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Features() {
    const headerRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible') },
            { threshold: 0.2 }
        )
        if (headerRef.current) observer.observe(headerRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="section features-section" id="features">
            <div className="container">
                <div className="section-header fade-up" ref={headerRef}>
                    <span className="badge badge-sage section-label">Platform Features</span>
                    <h2 className="display-2 section-title">
                        Everything you need to run a smarter hospital
                    </h2>
                    <p className="body-lg section-subtitle">
                        Purpose-built for healthcare professionals. Powerful analytics that translate data into decisive clinical action.
                    </p>
                </div>

                <div className="features-grid grid-4">
                    {features.map((f, i) => (
                        <FeatureCard key={i} feature={f} index={i % 4} />
                    ))}
                </div>
            </div>
        </section>
    )
}
