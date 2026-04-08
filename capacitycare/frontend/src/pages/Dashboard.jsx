import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const API_BASE = 'http://localhost:5001/api';

function StatCard({ label, value, unit, change, icon, progress, color }) {
    return (
        <div className="stat-card creative">
            <div className="stat-visual">
                {progress !== undefined ? (
                    <svg className="progress-ring" width="56" height="56">
                        <circle
                            className="progress-ring-bg"
                            cx="28" cy="28" r="24"
                            stroke="#e0e0e0" strokeWidth="6" fill="none"
                        />
                        <circle
                            className="progress-ring-bar"
                            cx="28" cy="28" r="24"
                            stroke={color || '#7a9e87'}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 24}
                            strokeDashoffset={2 * Math.PI * 24 * (1 - (progress || 0))}
                            style={{ transition: 'stroke-dashoffset 1s' }}
                        />
                        <text x="28" y="33" textAnchor="middle" fontSize="15" fill="#5b8c8a" fontWeight="bold">{value}{unit}</text>
                    </svg>
                ) : (
                    <span className="stat-icon creative-icon">{icon}</span>
                )}
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{progress !== undefined ? '' : value}{progress === undefined && unit ? <span className="stat-unit">{unit}</span> : null}</div>
                {change !== undefined && <div className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>{change > 0 ? '+' : ''}{change}{unit}</div>}
            </div>
        </div>
    );
}

function AlertCard({ type, message, icon }) {
    return (
        <div className={`alert-card ${type}`}> 
            <span className="alert-icon">{icon}</span>
            <span className="alert-message">{message}</span>
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [flowData, setFlowData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, flowRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/stats`),
                    fetch(`${API_BASE}/analytics/patient-flow`)
                ]);
                const statsJson = await statsRes.json();
                const flowJson = await flowRes.json();
                setStats(statsJson);
                setFlowData(flowJson);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Loading CapacityCare Insights...</div>;
    if (!stats) return <div className="error-screen">Error connecting to local data server.</div>;

    // Derived alerts for authenticity
    const alerts = [
        stats.icuOccupancy > 80 ? { type: 'high', message: 'Critical ICU Occupancy', icon: '⚠️' } : null,
        stats.bedsAvailable < 20 ? { type: 'medium', message: 'Low Bed Availability', icon: '🛏️' } : null,
    ].filter(Boolean);

    return (
        <div className="dashboard-root">
            <div className="dashboard-header-row">
                <div className="dashboard-title-block">
                    <h1 className="dashboard-title">Dashboard</h1>
                    <p className="dashboard-subtitle">Original Data from Local Dataset</p>
                </div>
                <div className="dashboard-profile-block">
                    <div className="profile-avatar">
                        <svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#a4c9b0" /><text x="50%" y="55%" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="bold" dy=".3em">H</text></svg>
                    </div>
                </div>
            </div>
            <div className="dashboard-main-grid">
                <div className="dashboard-main-left">
                    <div className="dashboard-stats-row">
                        <StatCard label="Total Patients" value={stats.totalPatients} icon="👥" unit="" color="#7a9e87" />
                        <StatCard label="Live Satisfaction" value={stats.satisfactionScore} unit="%" icon="⭐" color="#5b8c8a" />
                        <StatCard label="ICU Occupancy" value={stats.icuOccupancy} unit="%" progress={stats.icuOccupancy/100} color="#a4c9b0" />
                        <StatCard label="Wait Time" value={stats.avgWaitTime} unit="m" icon="⏱️" color="#8fb89f" />
                    </div>
                    <div className="dashboard-chart-card">
                        <div className="chart-header-row">
                            <span className="chart-title">Patient Flow (Real Admissions)</span>
                            <span className="chart-period">Last 7 days</span>
                        </div>
                        <div className="chart-area-placeholder">
                            {flowData && (() => {
                                const maxVal = Math.max(
                                    ...flowData.datasets[0].data, 
                                    ...flowData.datasets[1].data, 
                                    10
                                );
                                return (
                                    <svg width="100%" height="120" viewBox="0 0 320 120">
                                        <polyline 
                                            fill="none" 
                                            stroke="#7a9e87" 
                                            strokeWidth="3" 
                                            points={flowData.datasets[0].data.map((v, i) => `${(i / 6) * 320},${115 - ((v / maxVal) * 105)}`).join(' ')} 
                                        />
                                        <polyline 
                                            fill="none" 
                                            stroke="#5b8c8a" 
                                            strokeWidth="3" 
                                            points={flowData.datasets[1].data.map((v, i) => `${(i / 6) * 320},${115 - ((v / maxVal) * 105)}`).join(' ')} 
                                        />
                                    </svg>
                                );
                            })()}
                            <div className="chart-legend-row">
                                <span className="legend-dot" style={{ background: '#7a9e87' }}></span> Admissions
                                <span className="legend-dot" style={{ background: '#5b8c8a', marginLeft: 16 }}></span> Discharges
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dashboard-main-right">
                    <div className="alerts-block">
                        <div className="alerts-title">Key Alerts</div>
                        {alerts.length > 0 ? alerts.map((alert, i) => (
                            <AlertCard key={i} {...alert} />
                        )) : <p style={{color: '#64748b', fontSize: '0.9rem'}}>No critical alerts found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
