import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const links = [
        { label: 'Features', href: '#features' },
        { label: 'Analytics', href: '#visualization' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Use Cases', href: '#use-cases' },
        { label: 'Testimonials', href: '#testimonials' },
    ]

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
                            <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M6 10l2.5 4L11 8l3 8 2.5-5 2 3L21 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                            <defs>
                                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                                    <stop offset="0%" stopColor="#7a9e87" />
                                    <stop offset="100%" stopColor="#5b8c8a" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </span>
                    <span className="logo-text">CapacityCare</span>
                </Link>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    {links.map(l => (
                        <li key={l.label}>
                            <a href={l.href} className="nav-link" onClick={() => setMenuOpen(false)}>
                                {l.label}
                            </a>
                        </li>
                    ))}
                    <li className="nav-cta">
                        <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
                            Login
                        </Link>
                    </li>
                </ul>

                <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span className={menuOpen ? 'open' : ''} />
                    <span className={menuOpen ? 'open' : ''} />
                    <span className={menuOpen ? 'open' : ''} />
                </button>
            </div>
        </nav>
    )
}
