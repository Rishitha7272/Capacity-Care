import React, { useMemo, useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, BarChart, Bar, AreaChart, Area, Brush
} from 'recharts';
import './ResourceUtilization.css';

const API_BASE = 'http://localhost:5001/api';

const GaugeChart = ({ percent }) => {
    const data = [
        { value: percent, fill: percent > 90 ? '#ef4444' : percent > 50 ? '#a4c9b0' : '#f59e0b' },
        { value: 100 - percent, fill: '#f1f5f9' }
    ];
    return (
        <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                    />
                </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{percent}%</span>
                <p style={{ margin: '0', color: '#64748b', fontSize: '0.85rem' }}>Total Occupancy</p>
            </div>
        </div>
    );
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="res-tooltip" style={{ background: '#fff', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{label}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color, fontSize: '0.85rem', margin: '2px 0' }}>
                        {p.name}: {p.value}{p.name.includes('LOS') ? ' days' : ''}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function ResourceUtilization() {
    const [stats, setStats] = useState(null);
    const [depts, setDepts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, deptRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/stats`),
                    fetch(`${API_BASE}/analytics/departments`)
                ]);
                setStats(await statsRes.json());
                setDepts(await deptRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Loading Resource Data...</div>;

    const totalOccupancy = stats?.icuOccupancy || 0; // Simplified for demo

    return (
        <div className="resource-dashboard-root">
            <div className="resource-header-row">
                <div className="resource-header-titles">
                    <h1 className="resource-title">Resource Utilization & Efficiency</h1>
                    <p className="resource-subtitle">Original Data from Local Dataset with 10,000+ Records.</p>
                </div>
            </div>

            <div className="resource-kpi-grid">
                <div className="res-kpi-card">
                    <span className="res-kpi-label">Overall Bed Efficiency</span>
                    <span className="res-kpi-value">{totalOccupancy}%</span>
                    <span className="res-kpi-sub optimal">Live System Status</span>
                </div>
                <div className="res-kpi-card">
                    <span className="res-kpi-label">Staff on Duty</span>
                    <span className="res-kpi-value">{stats?.staffOnDuty || 0}</span>
                    <span className="res-kpi-sub">Total Active Staff</span>
                </div>
                <div className="res-kpi-card">
                    <span className="res-kpi-label">Available Capacity</span>
                    <span className="res-kpi-value">{stats?.bedsAvailable || 0}</span>
                    <span className="res-kpi-sub">Total Available Beds</span>
                </div>
                <div className="res-kpi-card">
                    <span className="res-kpi-label">Asset ROI Index</span>
                    <span className="res-kpi-value">0.96</span>
                    <span className="res-kpi-sub optimal">Healthy Resource Flow</span>
                </div>
            </div>

            <div className="resource-grid">
                <div className="res-chart-card col-span-1">
                    <div className="res-card-header">
                        <h3 className="res-card-title">Overall Bed Occupancy</h3>
                        <p className="res-card-subtitle">Real-time capacity tracking.</p>
                    </div>
                    <GaugeChart percent={totalOccupancy} />
                </div>

                <div className="res-chart-card col-span-3">
                    <div className="res-card-header">
                        <h3 className="res-card-title">Department Resource Breakdown</h3>
                        <p className="res-card-subtitle">Benchmarking usage of Beds and Staff. (Original Local Data)</p>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={depts}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="occupiedBeds" name="Occupied Beds" fill="#a4c9b0" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="availableBeds" name="Available Beds" fill="#f5d6b3" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="staffOnDuty" name="Staff on Duty" fill="#7a9e87" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="res-chart-card col-span-2">
                    <div className="res-card-header">
                        <h3 className="res-card-title">Bed Availability Details</h3>
                    </div>
                    <div className="bed-table-container">
                        <table className="bed-table">
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Total</th>
                                    <th>Occupied</th>
                                    <th>Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {depts.map((dept, i) => (
                                    <tr key={i}>
                                        <td>{dept.name}</td>
                                        <td>{dept.totalBeds}</td>
                                        <td>{dept.occupiedBeds}</td>
                                        <td style={{fontWeight: 700, color: dept.availableBeds < 5 ? '#ef4444' : '#10b981'}}>{dept.availableBeds}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="res-chart-card col-span-2">
                    <div className="res-card-header">
                        <h3 className="res-card-title">Average LOS per Department</h3>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={depts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="avgLOS" name="Avg Length of Stay (Days)" radius={[0, 4, 4, 0]}>
                                    {depts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.avgLOS > 8 ? '#ef4444' : '#a4c9b0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
