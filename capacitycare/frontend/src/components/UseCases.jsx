import { useEffect, useRef } from 'react'
import './UseCases.css'

const cases = [
    {
        color: 'sage',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="26" rx="6" fill="rgba(122,158,135,0.12)" stroke="#7a9e87" strokeWidth="2" />
                <path d="M4 18h32" stroke="#7a9e87" strokeWidth="1.5" opacity="0.5" />
                <rect x="14" y="4" width="12" height="8" rx="3" fill="rgba(122,158,135,0.2)" stroke="#7a9e87" strokeWidth="1.5" />
                <path d="M13 26h5M22 26h5M13 30h3M24 30h3" stroke="#7a9e87" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="22" r="3" fill="rgba(122,158,135,0.4)" />
            </svg>
        ),
        tag: 'Large Scale',
        title: 'Hospitals',
        subtitle: 'Full-spectrum analytics for multi-ward, multi-floor environments',
        highlights: [
            'Real-time multi-department dashboards',
            'Cross-ward patient flow optimization',
            'Executive reporting & compliance tracking',
            'Adaptive staffing & capacity planning',
        ],
        metric: { label: 'Avg. efficiency gain', value: '+34%' },
    },
    {
        color: 'teal',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="6" width="28" height="28" rx="8" fill="rgba(91,140,138,0.12)" stroke="#5b8c8a" strokeWidth="2" />
                <path d="M20 12v16M12 20h16" stroke="#5b8c8a" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="6" stroke="#5b8c8a" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            </svg>
        ),
        tag: 'Outpatient',
        title: 'Clinics',
        subtitle: 'Right-sized analytics for specialty and primary care clinics',
        highlights: [
            'Appointment and scheduling analytics',
            'Patient waiting time reduction',
            'Treatment outcome tracking',
            'Resource allocation per specialty',
        ],
        metric: { label: 'Wait time reduction', value: '-42%' },
    },
    {
        color: 'clay',
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="14" r="6" fill="rgba(196,137,106,0.15)" stroke="#c4896a" strokeWidth="2" />
                <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#c4896a" strokeWidth="2" strokeLinecap="round" />
                <path d="M28 22l4-4M32 22l-4-4" stroke="#c4896a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            </svg>
        ),
        tag: 'Administration',
        title: 'Healthcare Admins',
        subtitle: 'Executive visibility and governance tools for health system leaders',
        highlights: [
            'System-wide performance overview',
            'Budget and cost efficiency dashboards',
            'Regulatory compliance monitoring',
            'Staff performance and retention metrics',
        ],
        metric: { label: 'Reporting time saved', value: '18h/wk' },
    },
]

export default function UseCases() {
    const refs = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.1 }
        )
        refs.current.forEach(r => r && observer.observe(r))
        return () => observer.disconnect()
    }, [])

    return (
        <section className="section use-section" id="use-cases">
            <div className="container">
                <div className="section-header fade-up" ref={el => refs.current[0] = el}>
                    <span className="badge badge-teal section-label">Use Cases</span>
                    <h2 className="display-2 section-title">Built for every corner of healthcare</h2>
                    <p className="body-lg section-subtitle">
                        Whether you run a 50-bed clinic or a 1000-bed health system, CapacityCare adapts to your scale and complexity.
                    </p>
                </div>

                <div className="use-grid grid-3">
                    {cases.map((c, i) => (
                        <div
                            key={i}
                            className={`use-card card fade-up fade-up-delay-${i + 1} use-card-${c.color}`}
                            ref={el => refs.current[i + 1] = el}
                        >
                            <div className={`use-icon-wrap use-icon-${c.color}`}>
                                {c.icon}
                            </div>
                            <div className={`use-tag badge badge-${c.color}`}>{c.tag}</div>
                            <h3 className="h1 use-title">{c.title}</h3>
                            <p className="body-sm use-subtitle">{c.subtitle}</p>
                            <ul className="use-highlights">
                                {c.highlights.map((h, j) => (
                                    <li key={j}>
                                        <span className={`use-check use-check-${c.color}`}>✓</span>
                                        {h}
                                    </li>
                                ))}
                            </ul>
                            <div className={`use-metric use-metric-${c.color}`}>
                                <span className="use-metric-val">{c.metric.value}</span>
                                <span className="use-metric-label">{c.metric.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
