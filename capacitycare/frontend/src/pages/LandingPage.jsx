import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Activity, ShieldCheck, BarChart3, ArrowRight, TrendingUp, 
    Globe, HeartPulse
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const API_BASE = 'http://localhost:5001/api';

export default function LandingPage() {
    const navigate = useNavigate();
    const [flowData, setFlowData] = useState([]);
    const [stats, setStats] = useState(null);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className="lp-wrapper">
            <nav className="lp-navbar">
                <div className="lp-logo">
                    <HeartPulse size={32} strokeWidth={2.5} />
                    <span>CapacityCare</span>
                </div>
                <div className="lp-nav-links">
                    <a href="#features">Solutions</a>
                    <a href="#about">About Us</a>
                </div>
                <div className="lp-nav-actions">
                    <button className="lp-btn lp-btn-login" onClick={() => navigate('/login')}>Login</button>
                    <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>Request Demo</button>
                </div>
            </nav>

            <section className="lp-hero">
                <div className="lp-hero-flex">
                    <div className="lp-hero-content">
                        <motion.div 
                            className="lp-hero-tag"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            ✨ Powered by Local Massive Dataset (10,000+ Records)
                        </motion.div>
                        
                        <motion.h1 
                            className="lp-hero-title"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Optimize Clinical Flow with <span style={{ color: 'var(--lp-primary)' }}>Original Data.</span>
                        </motion.h1>

                        <motion.p 
                            className="lp-hero-subtitle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            CapacityCare has transitioned to a high-performance local data system. Experience authentic clinical intelligence without the overhead of cloud databases.
                        </motion.p>

                        <motion.div 
                            className="lp-hero-cta"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <button className="lp-btn lp-btn-primary" onClick={() => navigate('/login')}>Explore Analytics <ArrowRight size={18} style={{marginLeft: 8}} /></button>
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
                                <h5>Occupancy</h5>
                                <div>{stats?.icuOccupancy || 0}%</div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="lp-floating-card lp-fc-2"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <div className="lp-fc-icon"><ShieldCheck size={20} /></div>
                            <div className="lp-fc-info">
                                <h5>Capacity</h5>
                                <div style={{color: '#10b981'}}>{stats?.bedsAvailable || 0} Open</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="lp-hero-visual-wrapper" ref={ref}>
                    <motion.div 
                        className="lp-hero-visual"
                        initial={{ opacity: 0, y: 50 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 1.2 }}
                    >
                        <div className="lp-chart-container">
                            <div className="lp-chart-header">
                                <h4>Institutional Throughput Analysis (Live Local Data)</h4>
                                <div className="lp-chart-legend">
                                    <span className="dot admitted"></span> Admissions
                                    <span className="dot discharged"></span> Discharges
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={380}>
                                <AreaChart data={flowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAdmitted" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7a9e87" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#7a9e87" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorDischarged" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#c2d5c8" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#c2d5c8" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="admitted" 
                                        stroke="#7a9e87" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorAdmitted)"
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="discharged" 
                                        stroke="#c2d5c8" 
                                        strokeWidth={3} 
                                        fillOpacity={1} 
                                        fill="url(#colorDischarged)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="lp-stats">
                <div className="lp-stat-item">
                    <h2>10,000+</h2>
                    <p>Original Records</p>
                </div>
                <div className="lp-stat-item">
                    <h2>{stats?.totalPatients || 0}</h2>
                    <p>Processed Patients</p>
                </div>
                <div className="lp-stat-item">
                    <h2>100%</h2>
                    <p>Local Performance</p>
                </div>
            </section>

            <footer style={{ padding: '80px 5% 40px', background: '#fff', borderTop: '1px solid var(--lp-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px', flexWrap: 'wrap', gap: '40px' }}>
                    <div style={{ maxWidth: '300px' }}>
                        <div className="lp-logo" style={{ marginBottom: '20px' }}>
                            <HeartPulse size={28} />
                            <span>CapacityCare</span>
                        </div>
                        <p style={{ color: 'var(--lp-text-muted)', fontSize: '14px', lineHeight: 1.6 }}>Redesigning healthcare through the lens of data visualization and local-first architecture.</p>
                    </div>
                </div>
                <div style={{ textAlign: 'center', paddingTop: '40px', borderTop: '1px solid var(--lp-border)', color: 'var(--lp-text-muted)', fontSize: '12px' }}>
                    © 2026 CapacityCare Hospital Analytics. Original Local Version.
                </div>
            </footer>
        </div>
    );
}
