import './Footer.css'

export default function Footer() {
    const year = new Date().getFullYear()

    const links = {
        Product: ['Features', 'Analytics', 'Integrations', 'Pricing', 'Changelog'],
        Solutions: ['Hospitals', 'Clinics', 'Health Admins', 'Public Health', 'Telemedicine'],
        Company: ['About', 'Careers', 'Blog', 'Press', 'Contact'],
        Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Security'],
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-main">
                    {/* Brand */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <rect width="28" height="28" rx="8" fill="url(#footerLogoGrad)" />
                                <path d="M8 14h12M14 8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                                        <stop offset="0%" stopColor="#7a9e87" />
                                        <stop offset="100%" stopColor="#5b8c8a" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span>CapacityCare</span>
                        </div>
                        <p className="body-sm footer-tagline">
                            The intelligent hospital data platform that transforms clinical data into decisive action.
                        </p>
                        <div className="footer-badges">
                            <span className="badge badge-sage">HIPAA Ready</span>
                            <span className="badge badge-teal">SOC 2</span>
                            <span className="badge badge-sage">FHIR</span>
                        </div>
                        <div className="footer-social">
                            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
                                <a key={s} href="#" className="social-link" aria-label={s}>{s[0]}</a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category} className="footer-col">
                            <h4 className="footer-col-title">{category}</h4>
                            <ul>
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="footer-link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer-bottom">
                    <p className="body-sm" style={{ color: 'var(--text-muted)' }}>
                        © {year} CapacityCare Inc. All rights reserved.
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#" className="footer-link">Privacy</a>
                        <a href="#" className="footer-link">Terms</a>
                        <a href="#" className="footer-link">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
