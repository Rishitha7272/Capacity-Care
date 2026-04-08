import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './HowItWorks.css'

const steps = [
    {
        num: '01',
        color: 'sage',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="6" width="24" height="20" rx="4" stroke="#7a9e87" strokeWidth="2" fill="rgba(122,158,135,0.1)" />
                <path d="M10 14h12M10 18h8" stroke="#7a9e87" strokeWidth="2" strokeLinecap="round" />
                <path d="M10 10h5" stroke="#7a9e87" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="10" r="3" fill="#7a9e87" opacity="0.6" />
            </svg>
        ),
        title: 'Collect',
        description: 'Seamlessly connect all your hospital systems — EHR, IoT devices, lab results, scheduling — into one unified data stream.',
    },
    {
        num: '02',
        color: 'teal',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="#5b8c8a" strokeWidth="2" fill="rgba(91,140,138,0.1)" />
                <path d="M8 16l4 4 8-8" stroke="#5b8c8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="16" r="5" stroke="#5b8c8a" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
            </svg>
        ),
        title: 'Analyze',
        description: 'Our AI engine processes millions of data points in real-time, detecting patterns, anomalies, and operational signals automatically.',
    },
    {
        num: '03',
        color: 'clay',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="3" y="8" width="26" height="18" rx="4" stroke="#c4896a" strokeWidth="2" fill="rgba(196,137,106,0.1)" />
                <path d="M7 20 L11 15 L15 18 L19 12 L25 16" stroke="#c4896a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 24h18" stroke="#c4896a" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
        ),
        title: 'Visualize',
        description: 'Beautiful, intuitive dashboards translate complex analytics into clear visual stories your entire team can understand and act upon.',
    },
    {
        num: '04',
        color: 'sage',
        icon: (
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4l3 9H28l-7.5 5.5 3 9L16 23l-7.5 5.5 3-9L4 13h9z" stroke="#7a9e87" strokeWidth="2" fill="rgba(122,158,135,0.1)" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Act',
        description: 'Get actionable recommendations, automated alerts, and decision support tools that empower your staff to act with precision and confidence.',
    },
]

export default function HowItWorks() {
    const refs = useRef([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
            { threshold: 0.15 }
        )
        refs.current.forEach(r => r && observer.observe(r))
        return () => observer.disconnect()
    }, [])

    return (
        <section className="section how-section" id="how-it-works">
            <div className="container">
                <div className="section-header fade-up" ref={el => refs.current[0] = el}>
                    <span className="badge badge-clay section-label">How It Works</span>
                    <h2 className="display-2 section-title">
                        From raw data to decisive action
                    </h2>
                    <p className="body-lg section-subtitle">
                        A simple, powerful four-step journey that transforms hospital complexity into clarity.
                    </p>
                </div>

                <div className="steps-container">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`step-item fade-up fade-up-delay-${i + 1}`}
                            ref={el => refs.current[i + 1] = el}
                        >
                            {/* Connector line */}
                            {i < steps.length - 1 && <div className="step-connector" />}

                            <div className={`step-num-wrap step-color-${step.color}`}>
                                <span className="step-num">{step.num}</span>
                            </div>

                            <div className={`step-icon-wrap step-icon-${step.color}`}>
                                {step.icon}
                            </div>

                            <h3 className="h2 step-title">{step.title}</h3>
                            <p className="body-sm step-desc">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA inline */}
                <div className="how-bottom fade-up" ref={el => refs.current[5] = el}>
                    <p className="body-lg" style={{ color: 'var(--text-secondary)' }}>
                        Ready to see it in action?
                    </p>
                    <Link to="/login" className="btn btn-primary">Login Now</Link>
                    <a href="#visualization" className="btn btn-secondary">Explore Demo</a>
                </div>
            </div>
        </section>
    )
}
