import { useEffect, useRef, useState } from 'react'
import './Testimonials.css'

const testimonials = [
    {
        name: 'Dr. Sarah Mitchell',
        role: 'Chief Medical Officer',
        hospital: 'Metro General Hospital',
        avatar: 'SM',
        color: 'sage',
        rating: 5,
        text: 'CapacityCare transformed our ICU management. We reduced wait times by 40% and improved patient outcomes significantly within just 3 months of deployment.',
    },
    {
        name: 'James Thornton',
        role: 'Hospital Administrator',
        hospital: "St. Luke's Healthcare Network",
        avatar: 'JT',
        color: 'teal',
        rating: 5,
        text: 'The advanced data visualization caught a staffing shortage before it happened. We were able to reallocate resources proactively. This platform pays for itself every single week.',
    },
    {
        name: 'Dr. Priya Sharma',
        role: 'Data Analytics Lead',
        hospital: 'Sunrise Medical Center',
        avatar: 'PS',
        color: 'clay',
        rating: 5,
        text: 'The visualizations are stunning and the insights are truly actionable. Our clinical board now makes data-driven decisions with complete confidence.',
    },
]

function Stars({ count }) {
    return (
        <div className="stars">
            {Array.from({ length: count }, (_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1l1.6 3.3 3.6.5-2.6 2.5.6 3.6L7 9.2l-3.2 1.7.6-3.6L1.8 4.8l3.6-.5z" fill="#c4896a" />
                </svg>
            ))}
        </div>
    )
}

export default function Testimonials() {
    const [active, setActive] = useState(1)
    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    // Auto-rotate
    useEffect(() => {
        const interval = setInterval(() => {
            setActive(prev => (prev + 1) % testimonials.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="section testi-section" id="testimonials" ref={sectionRef}>
            <div className="container">
                <div className={`section-header fade-up ${visible ? 'visible' : ''}`}>
                    <span className="badge badge-clay section-label">Testimonials</span>
                    <h2 className="display-2 section-title">Trusted by healthcare leaders</h2>
                    <p className="body-lg section-subtitle">
                        Join 200+ hospitals already using CapacityCare to transform their operations.
                    </p>
                </div>

                {/* Logos strip */}
                <div className={`trust-strip fade-up fade-up-delay-1 ${visible ? 'visible' : ''}`}>
                    {['Metro General', "St. Luke's", 'Sunrise Medical', 'Valley Health', 'CityMed Group'].map((name, i) => (
                        <div key={i} className="trust-logo">{name}</div>
                    ))}
                </div>

                {/* Main testimonial */}
                <div className={`testi-main fade-up fade-up-delay-2 ${visible ? 'visible' : ''}`}>
                    <div className="testi-quote-mark">"</div>
                    <p className="testi-quote">{testimonials[active].text}</p>
                    <div className="testi-author">
                        <div className={`testi-avatar testi-avatar-${testimonials[active].color}`}>
                            {testimonials[active].avatar}
                        </div>
                        <div>
                            <div className="testi-name">{testimonials[active].name}</div>
                            <div className="testi-role">{testimonials[active].role} · {testimonials[active].hospital}</div>
                        </div>
                        <Stars count={testimonials[active].rating} />
                    </div>
                </div>

                {/* Dots */}
                <div className="testi-dots">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            className={`testi-dot ${i === active ? 'active' : ''}`}
                            onClick={() => setActive(i)}
                            aria-label={`Testimonial ${i + 1}`}
                        />
                    ))}
                </div>

                {/* Card row */}
                <div className={`testi-cards grid-3 fade-up fade-up-delay-3 ${visible ? 'visible' : ''}`}>
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className={`testi-card card ${i === active ? 'testi-card-active' : ''}`}
                            onClick={() => setActive(i)}
                        >
                            <Stars count={t.rating} />
                            <p className="body-sm testi-card-text">{t.text}</p>
                            <div className="testi-card-author">
                                <div className={`testi-avatar testi-avatar-sm testi-avatar-${t.color}`}>{t.avatar}</div>
                                <div>
                                    <div className="testi-name-sm">{t.name}</div>
                                    <div className="testi-role-sm">{t.hospital}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
