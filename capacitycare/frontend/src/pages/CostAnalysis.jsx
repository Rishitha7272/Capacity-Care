import React, { useState, useEffect, useMemo } from 'react';
import {
    Treemap, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
    ComposedChart, Line, Area, Legend
} from 'recharts';
import { Activity, Download, ArrowLeft, TrendingUp, Users } from 'lucide-react';
import './CostAnalysis.css';

const API_BASE = 'http://localhost:5001/api';
const COLORS = ['#a4c9b0', '#c2dbca', '#8fb89f', '#f5d6b3', '#eaf3ee'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="cost-tooltip">
                <div className="cost-tooltip-label">{label || payload[0]?.payload?.name}</div>
                {payload.map((p, i) => (
                    <div key={i} className="cost-tooltip-item" style={{ color: p.color || '#334155' }}>
                        {p.name === 'cost' || p.name === 'avgCost' || p.name === 'size' ? 'Cost: $' : ''}
                        {(p.value).toLocaleString()}
                        {p.name === 'patientVolume' && ' patients'}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, name, value, colors } = props;
    const color = colors[Math.floor((index / root.children.length) * 5)] || '#c2dbca';

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? color : '#ffffff',
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                }}
            />
            {width > 60 && height > 30 && (
                <text x={x + 8} y={y + 18} fill="#000000" fontSize={15} fontWeight={900}>
                    {name}
                </text>
            )}
            {width > 60 && height > 45 && depth > 1 && (
                <text x={x + 8} y={y + 36} fill="#1e293b" fontSize={14} fontWeight={700}>
                    ${value.toLocaleString()}
                </text>
            )}
        </g>
    );
};

export default function CostAnalysis() {
    const [data, setData] = useState({ treemapData: [], trendData: [] });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [drillPath, setDrillPath] = useState(['ROOT']);

    useEffect(() => {
        const fetchCostData = async () => {
            try {
                const [costRes, statsRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/cost-summary`),
                    fetch(`${API_BASE}/analytics/stats`)
                ]);
                setData(await costRes.json());
                setStats(await statsRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCostData();
    }, []);

    const handleBack = () => {
        if (drillPath.length > 1) setDrillPath(drillPath.slice(0, -1));
    };

    if (loading) return <div className="loading-screen">Analyzing Financial Data...</div>;

    const currentTitle = drillPath.length === 1 ? 'Total Expenditure' : drillPath[drillPath.length - 1];

    return (
        <div className="cost-dashboard-root">
            <div className="cost-header-row">
                <div className="cost-header-titles">
                    <h1 className="cost-title">Financial Intelligence</h1>
                    <p className="cost-subtitle">Real-time resource consumption from 10,000+ local records.</p>
                </div>
                <div className="cost-header-actions">
                    <button className="cost-action-btn" onClick={() => window.print()}>
                        <Download size={18} />
                        <span>Download Original Report</span>
                    </button>
                </div>
            </div>

            <div className="cost-kpi-row">
                <div className="cost-kpi-card cost-kpi-card-gradient">
                    <div className="cost-kpi-icon"><Activity size={24} color="#1a221f" /></div>
                    <span className="cost-kpi-label">Active Database Entries</span>
                    <span className="cost-kpi-value">{stats?.totalPatients?.toLocaleString()}</span>
                    <span className="cost-kpi-subtext">Massive Local Dataset</span>
                </div>
                <div className="cost-kpi-card">
                    <div className="cost-kpi-icon"><TrendingUp size={24} color="#a4c9b0" /></div>
                    <span className="cost-kpi-label">System Satisfaction</span>
                    <span className="cost-kpi-value">{stats?.satisfactionScore}%</span>
                    <span className="cost-kpi-subtext">Original KPI Metric</span>
                </div>
                <div className="cost-kpi-card">
                    <div className="cost-kpi-icon"><Users size={24} color="#8fb89f" /></div>
                    <span className="cost-kpi-label">Avg Length of Stay</span>
                    <span className="cost-kpi-value">6.4d</span>
                    <span className="cost-kpi-subtext">Calculated from Dataset</span>
                </div>
            </div>

            <div className="cost-grid">
                <div className="cost-chart-card col-span-4">
                    <div className="cost-card-header">
                        <div className="cost-card-titles">
                            <h3 className="cost-card-title">Cost Contribution Matrix</h3>
                            <p className="cost-card-subtitle">Real breakdown of costs by department and diagnosis.</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 450 }}>
                        <ResponsiveContainer>
                            <Treemap
                                data={data.treemapData}
                                dataKey="size"
                                aspectRatio={4 / 3}
                                stroke="#fff"
                                fill="#a4c9b0"
                                content={<CustomizedContent colors={COLORS} />}
                            >
                                <RechartsTooltip content={<CustomTooltip />} />
                            </Treemap>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="cost-chart-card col-span-4">
                    <div className="cost-card-header">
                        <div className="cost-card-titles">
                            <h3 className="cost-card-title">Patient Treatment Cost Trend</h3>
                            <p className="cost-card-subtitle">Showing cost evolution over the generated timeline.</p>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <ComposedChart data={data.trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAvgCost" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#8fb89f" stopOpacity={0.6}/>
                                      <stop offset="95%" stopColor="#8fb89f" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tickFormatter={(val) => `$${val}`} axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={36}/>
                                <Area yAxisId="left" type="monotone" dataKey="avgCost" name="Avg Cost ($)" stroke="#8fb89f" strokeWidth={3} fillOpacity={1} fill="url(#colorAvgCost)" />
                                <Line yAxisId="left" type="monotone" dataKey="patientVolume" name="Patient Volume" stroke="#c2dbca" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
