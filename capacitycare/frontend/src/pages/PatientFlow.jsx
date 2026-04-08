import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend, ScatterChart, Scatter, 
    ZAxis, Cell, ComposedChart
} from 'recharts';
import { 
    Users, Clock, AlertTriangle, ArrowUpRight, 
    Maximize2, Filter, Calendar 
} from 'lucide-react';
import './PatientFlow.css';

const API_BASE = 'http://localhost:5001/api';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="flow-tooltip">
                <div className="flow-tooltip-label">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} className="flow-tooltip-item" style={{ color: p.color || p.fill }}>
                        {p.name}: {p.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function PatientFlow() {
    const [timeRange, setTimeRange] = useState('7d');
    const [flowData, setFlowData] = useState(null);
    const [deptData, setDeptData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const [flowRes, deptRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/patient-flow`),
                    fetch(`${API_BASE}/analytics/departments`)
                ]);
                setFlowData(await flowRes.json());
                setDeptData(await deptRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlow();
    }, []);

    if (loading) return <div className="loading-screen">Analyzing Patient Flow...</div>;

    return (
        <div className="flow-dashboard-root">
            <div className="flow-header-row">
                <div className="flow-header-titles">
                    <h1 className="flow-title">Patient Flow & Workload</h1>
                    <p className="flow-subtitle">Predictive analytics derived from original local dataset of 10,000+ records.</p>
                </div>
            </div>

            <div className="flow-filters-bar">
                <div className="filter-group">
                    <Calendar size={18} className="filter-label" />
                    <span className="filter-label">Time Range</span>
                    <select className="filter-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="7d">Last 7 Days</option>
                    </select>
                </div>
            </div>

            <div className="flow-grid">
                <div className="flow-chart-card col-span-4">
                    <div className="flow-card-header">
                        <div className="flow-card-titles">
                            <h3 className="flow-card-title">Admission vs. Discharge Flow</h3>
                            <p className="flow-card-subtitle">Monitoring hospital overload index with real data.</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <LineChart data={flowData?.labels.map((label, i) => ({
                                month: label,
                                admissions: flowData.datasets[0].data[i],
                                discharges: flowData.datasets[1].data[i]
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="admissions" name="Admissions" stroke="#a4c9b0" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="discharges" name="Discharges" stroke="#f5d6b3" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flow-chart-card col-span-4">
                    <div className="flow-card-header">
                        <div className="flow-card-titles">
                            <h3 className="flow-card-title">Department Load Status</h3>
                            <p className="flow-card-subtitle">Real-time status based on workload vs. capacity. (Local Original)</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={deptData} layout="vertical" margin={{ left: 30, right: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                <XAxis type="number" axisLine={false} tickLine={false} />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 600}} width={100} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar dataKey="occupiedBeds" name="Current Load" radius={[0, 4, 4, 0]} barSize={20}>
                                    {deptData.map((entry, index) => {
                                        const ratio = entry.occupiedBeds / entry.totalBeds;
                                        const fill = ratio > 0.9 ? '#ef4444' : ratio > 0.7 ? '#f59e0b' : '#a4c9b0';
                                        return <Cell key={`cell-${index}`} fill={fill} />;
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flow-chart-card col-span-4">
                    <div className="flow-card-header">
                        <div className="flow-card-titles">
                            <h3 className="flow-card-title">Staff Efficiency (Workload Index)</h3>
                            <p className="flow-card-subtitle">Active staff on duty per clinical department.</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={deptData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar dataKey="staffOnDuty" name="Staff on Duty" fill="#7a9e87" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
