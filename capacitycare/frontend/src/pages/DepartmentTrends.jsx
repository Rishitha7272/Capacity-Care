import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './PageTemplate.css'

const API_BASE = 'http://localhost:5001/api';

export default function DepartmentTrends() {
    const [deptData, setDeptData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await fetch(`${API_BASE}/analytics/departments`);
                const data = await res.json();
                setDeptData(data);
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDepts();
    }, []);

    if (loading) return <div className="page-container"><div className="loading-screen">Loading Department Analytics...</div></div>;

    const topDept = deptData.length > 0 ? deptData.reduce((prev, current) => (prev.efficiency > current.efficiency) ? prev : current) : null;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Department Trends</h1>
                <p className="page-subtitle">Analyze performance and trends across hospital departments</p>
            </div>

            <div className="content-grid">
                <div className="card full-width">
                    <div className="card-header">
                        <h2>Department Performance Scorecard</h2>
                        <span className="badge">Current Month</span>
                    </div>
                    <div className="scorecard">
                        {deptData.slice(0, 6).map((dept, i) => (
                            <div className="scorecard-item" key={i}>
                                <div className="score-header">
                                    <span>{dept.name}</span>
                                    <strong className={`score-badge ${dept.efficiency >= 90 ? 'positive' : dept.efficiency >= 80 ? 'neutral' : 'negative'}`}>
                                        {dept.efficiency}%
                                    </strong>
                                </div>
                                <p className="score-desc">Average wait time: {dept.waitTime} min</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2>Top Performing Department</h2>
                        <span className="badge">This Month</span>
                    </div>
                    {topDept && (
                        <div className="top-dept">
                            <div className="dept-name">{topDept.name}</div>
                            <div className="dept-stats">
                                <div className="stat">
                                    <span>Efficiency</span>
                                    <strong>{topDept.efficiency}%</strong>
                                </div>
                                <div className="stat">
                                    <span>Patient Satisfaction</span>
                                    <strong>{topDept.satisfaction}/5</strong>
                                </div>
                                <div className="stat">
                                    <span>Complications</span>
                                    <strong>{topDept.complications}%</strong>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="card full-width" style={{ marginTop: '20px' }}>
                    <div className="card-header">
                        <h2>Department Efficiency Comparison</h2>
                        <span className="badge">Live Data</span>
                    </div>
                    <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                        <ResponsiveContainer>
                            <BarChart data={deptData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="efficiency" name="Efficiency (%)" fill="#7a9e87" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="readmissionRate" name="Readmission (%)" fill="#f5d6b3" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
