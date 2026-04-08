import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Activity, ShieldCheck, BarChart3, ArrowRight, TrendingUp, 
    Globe, HeartPulse, Zap, Users, LayoutDashboard, 
    Microscope, Briefcase, Award, Database, Cpu, 
    CheckCircle2, Server
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const API_BASE = 'http://localhost:5001/api';

/* ─── Advanced Simulation Component ─────────────────────────────── */

const AdvancedSimulation = () => {
    const [events, setEvents] = useState([
        "ICU Admission: Room 4B",
        "Lab Results: STAT Ready",
        "Discharge Summary: Ortho",
        "Bed Census Updated: 02:30",
        "Emergency Bypass: Lifted"
    ]);
    const [processedCount, setProcessedCount] = useState(12840);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsProcessing(true);
            setTimeout(() => setIsProcessing(false), 800);
            
            setEvents(prev => {
                const newEventList = [...prev];
                const clinicalNotes = [
                    "Patient Flow: Surgery → Recovery",
                    "Telemetry Alert: Ward 7",
                    "Pharmacy: Order Ingested",
                    "Nurse Shift: Synchronized",
                    "Capacity: +2 Beds (Gen Ward)"
                ];
                newEventList.unshift(clinicalNotes[Math.floor(Math.random() * clinicalNotes.length)]);
                return newEventList.slice(0, 5);
            });
            setProcessedCount(prev => prev + Math.floor(Math.random() * 5) + 1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="lp-advanced-stage">
            <div className="lp-stage-grid"></div>
            
            {/* Left Column: Event Stream */}
            <div className="lp-stage-col lp-col-left">
                <div className="lp-col-header">
                    <Database size={14} /> LIVE EVENT STREAM
                </div>
                <div className="lp-event-stream">
                    <AnimatePresence mode="popLayout">
                        {events.map((event, i) => (
                            <motion.div 
                                key={event + i}
                                className="lp-event-pill"
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1 - (i * 0.2), x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="pill-dot"></div>
                                {event}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Center Column: The Core */}
            <div className="lp-stage-col lp-col-center">
                <div className="lp-core-wrapper">
                    <motion.div 
                        className={`lp-core-ring ring-1 ${isProcessing ? 'active' : ''}`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                        className={`lp-core-ring ring-2 ${isProcessing ? 'active' : ''}`}
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="lp-core-brain">
                        <Cpu size={32} className={isProcessing ? 'pulse-icon' : ''} />
                    </div>
                </div>
                <div className="lp-core-label">
                    <div className="core-title">CAPACITYCORE V3</div>
                    <div className="core-status">PROCESSING...</div>
                </div>
            </div>

            {/* Right Column: Key Insights */}
            <div className="lp-stage-col lp-col-right">
                <div className="lp-col-header">
                    <Server size={14} /> SYSTEM ANALYTICS
                </div>
                <div className="lp-insight-stack">
                    <div className="lp-insight-card highlight">
                        <div className="insight-label">RECORDS PROCESSED</div>
                        <div className="insight-value">{processedCount.toLocaleString()}</div>
                    </div>
                    <div className="lp-insight-card">
                        <div className="insight-label">THROUGHPUT SPEED</div>
                        <div className="insight-value">0.8ms</div>
                    </div>
                    <div className="lp-insight-card">
                        <div className="insight-label">DATA INTEGRITY</div>
                        <div className="insight-value neon">100.0%</div>
                    </div>
                </div>
            </div>

            {/* Connecting Paths */}
            <svg className="lp-connecting-svg" width="100%" height="100%" preserveAspectRatio="none">
                <path d="M 250,200 L 450,200" className="path-line" strokeDasharray="5,5" />
                <path d="M 550,200 L 750,200" className="path-line" strokeDasharray="5,5" />
                {isProcessing && (
                    <>
                        <motion.circle r="3" fill="#7a9e87" initial={{ cx: 250, cy: 200 }} animate={{ cx: 450 }} transition={{ duration: 0.5 }} />
                        <motion.circle r="3" fill="#7a9e87" initial={{ cx: 550, cy: 200 }} animate={{ cx: 750 }} transition={{ duration: 0.5 }} />
                    </>
                )}
            </svg>
        </div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────── */

export default function LandingPage() {
    const navigate = useNavigate();
    const [flowData, setFlowData] = useState([]);
    const [stats, setStats] = useState(null);
    const { ref: demoRef, inView: demoInView } = useInView({ triggerOnce: true, threshold: 0.1 });

    useEffect(() => {
        const fetchLandingData = async () => {
            try {
                const [flowRes, statsRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/patient-flow`),
                    fetch(`${API_BASE}/analytics/stats`)
                ]);
                const fData = await flowRes.json();
                setFlowData(fData.labels.map((label, i) => ({
                    name: label,
                    admitted: fData.datasets[0].data[i],
                    discharged: fData.datasets[1].data[i]
                })));
                setStats(await statsRes.json());
            } catch (err) {
                console.error('Landing fetch error:', err);
            }
        };
        fetchLandingData();
    }, []);

    return (
        <div className="lp-wrapper">
            <nav className="lp-navbar">
                <div className="lp-logo">
                    <HeartPulse size={32} strokeWidth={2.5} />
                    <span>CapacityCare</span>
                </div>
                <div className="lp-nav-links">
                    <a href="#features">Solutions</a>
                    <a href="#demo">Live Demo</a>
                    <a href="#about">About Us</a>
                </div>
                <div className="lp-nav-actions">
                    <button className="lp-btn lp-btn-login" onClick={() => navigate('/login')}>Login</button>
                    <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>Access Command Center</button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="lp-hero">
                <div className="lp-hero-flex">
                    <div className="lp-hero-content">
                        <motion.div 
                            className="lp-hero-tag"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            🏥 Clinical Intelligence Redefined
                        </motion.div>
                        
                        <motion.h1 
                            className="lp-hero-title"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Synchronize Your Hospital with <span style={{ color: 'var(--lp-primary)' }}>Authentic Insights.</span>
                        </motion.h1>

                        <motion.p 
                            className="lp-hero-subtitle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            CapacityCare leverages a massive local dataset of 10,000+ records to provide real-time clinical flow optimization.
                        </motion.p>

                        <motion.div 
                            className="lp-hero-cta"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>Start Monitoring Now <ArrowRight size={18} style={{marginLeft: 8}} /></button>
                        </motion.div>
                    </div>

                    <div className="lp-hero-graphic">
                        <motion.div 
                            className="lp-floating-card lp-fc-1"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="lp-fc-icon"><Activity size={20} /></div>
                            <div className="lp-fc-info">
                                <h5>Census</h5>
                                <div>10,000+</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Simulation Demo Section */}
            <section className="lp-demo-section" id="demo" ref={demoRef}>
                <div className="lp-section-header">
                    <span className="lp-section-label">Institutional Pulse</span>
                    <h2 className="lp-section-title">The Real-Time Simulation</h2>
                    <p className="lp-section-subtitle">Visualizing institutional throughput and clinical events across 10,000+ records.</p>
                </div>

                <div className="lp-demo-container-v2">
                    {demoInView && <AdvancedSimulation />}
                </div>
            </section>

            {/* Solutions / Features Section */}
            <section className="lp-features" id="features">
                <div className="lp-section-header">
                    <span className="lp-section-label">Core Capabilities</span>
                    <h2 className="lp-section-title">Analytical Precision for Modern Care</h2>
                </div>
                <div className="lp-features-grid">
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><LayoutDashboard size={24} /></div>
                        <h3>Clinical Flow Hub</h3>
                        <p>Coordinate admissions and discharges with a 7-day smoothed model built on original local data.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><TrendingUp size={24} /></div>
                        <h3>Financial Intelligence</h3>
                        <p>Map revenue contributions by department and identify high-value efficiency zones.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon"><Microscope size={24} /></div>
                        <h3>Disease Surveillance</h3>
                        <p>Monitor intensity across age groups and stage progression using advanced visualizations.</p>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="lp-about" id="about">
                <div className="lp-section-header">
                    <span className="lp-section-label">Institutional Profile</span>
                    <h2 className="lp-section-title">The Standard in Clinical Data Governance</h2>
                    <p className="lp-section-subtitle">Since 2026, CapacityCare has been dedicated to empowering healthcare providers with sovereign, high-fidelity analytical intelligence.</p>
                </div>
                
                <div className="lp-about-grid">
                    <div className="lp-about-card">
                        <div className="lp-about-icon"><ShieldCheck size={32} /></div>
                        <h3>Clinical Data Sovereignty</h3>
                        <p>We provide medical institutions with absolute control over their sensitive data through our local-first deployment architecture, ensuring privacy without compromise.</p>
                    </div>
                    <div className="lp-about-card">
                        <div className="lp-about-icon"><Award size={32} /></div>
                        <h3>Evidence-Based Precision</h3>
                        <p>Our visualization engine is built on a foundation of 10,000+ authentic clinical records, providing a truthful baseline for critical institutional decisions.</p>
                    </div>
                    <div className="lp-about-card">
                        <div className="lp-about-icon"><Users size={32} /></div>
                        <h3>Collaborative Intelligence</h3>
                        <p>We work alongside senior healthcare leadership to bridge the gap between complex raw data and actionable operational strategies.</p>
                    </div>
                </div>

                <div className="lp-vision-statement">
                    <div className="lp-vision-content">
                        <h4>Our Visionary Leadership</h4>
                        <p>Founded by clinical data scientists and hospital administrators, CapacityCare was born from a singular vision: to democratize high-performance analytics for the front-line healthcare heroes. We believe that clarity in the command center leads to better outcomes at the bedside.</p>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="lp-stats">
                <div className="lp-stat-item">
                    <h2>10,000+</h2>
                    <p>Clinical Records</p>
                </div>
                <div className="lp-stat-item">
                    <h2>100%</h2>
                    <p>Local Performance</p>
                </div>
                <div className="lp-stat-item">
                    <h2>Instant</h2>
                    <p>Insight Fetch</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer">
                <div className="lp-footer-bottom">
                    © 2026 CapacityCare Hospital Analytics. All Clinical Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
