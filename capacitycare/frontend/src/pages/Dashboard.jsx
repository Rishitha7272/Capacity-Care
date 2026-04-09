import React, { useEffect, useState, useRef } from 'react';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    Tooltip as RechartsTooltip, Legend,
    ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar
} from 'recharts';
import { 
    Activity, Users, Clock, 
    Bell, Lightbulb, AlertCircle, ChevronRight,
    TrendingUp, ShieldCheck, PieChart as PieIcon,
    Layers, DollarSign, Search, X
} from 'lucide-react';
import './Dashboard.css';

const API_BASE = 'http://localhost:5001/api';

/* ─── Soft Color Palette ────────────────────────────────────────── */
const SOFT_COLORS = {
    primary: '#7a9e87',     // Sage Green
    secondary: '#a4c9b0',   // Light Sage
    accent: '#8fb89f',      // Soft Emerald
    highlight: '#f5d6b3',   // Pale Sand
    muted: '#cbd5e1',       // Soft Slate
    success: '#7ca58a',     // Success Sage
    alert_high: '#fca5a5',
    alert_medium: '#fdba74',
    bg: '#f8faf9'
};

/* ─── Components ──────────────────────────────────────────────────── */

function StatCard({ label, value, unit, icon, progress, color }) {
    return (
        <div className="stat-card creative">
            <div className="stat-visual">
                {progress !== undefined ? (
                    <svg className="progress-ring" width="56" height="56">
                        <circle className="progress-ring-bg" cx="28" cy="28" r="24" stroke="#eef2f0" strokeWidth="5" fill="none" />
                        <circle className="progress-ring-bar" cx="28" cy="28" r="24" 
                            stroke={color || SOFT_COLORS.primary} strokeWidth="5" fill="none"
                            strokeDasharray={2 * Math.PI * 24} 
                            strokeDashoffset={2 * Math.PI * 24 * (1 - (progress || 0))}
                            style={{ transition: 'stroke-dashoffset 1s' }}
                        />
                        <text x="50%" y="55%" textAnchor="middle" fontSize="11" fill={color || SOFT_COLORS.primary} fontWeight="700" dy=".3em">{value}{unit}</text>
                    </svg>
                ) : (
                    <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15` }}>
                        <div style={{ color: color }}>{icon}</div>
                    </div>
                )}
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                {progress === undefined && (
                    <div className="stat-value">
                        {value.toLocaleString()}<span className="stat-unit">{unit}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function AlertCard({ type, message, icon }) {
    const alertColors = {
        high: SOFT_COLORS.alert_high,
        medium: SOFT_COLORS.alert_medium,
        low: SOFT_COLORS.muted
    };
    return (
        <div className={`alert-card-minimal ${type}`} style={{ borderLeftColor: alertColors[type] }}> 
            <div className="alert-icon-mini">{icon}</div>
            <div className="alert-body">
                <span className="alert-text">{message}</span>
            </div>
            <ChevronRight className="alert-chevron" size={14} />
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="dashboard-tooltip">
                <div className="tooltip-title">{label || payload[0].name}</div>
                {payload.map((p, i) => (
                    <div key={i} className="tooltip-item" style={{ color: p.color || p.fill || '#475569' }}>
                        {p.name}: {p.name.includes('Revenue') ? '₹' : ''}{p.value.toLocaleString()}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ─── Main Component ─────────────────────────────────────────────── */

export default function Dashboard({ user }) {
    const [stats, setStats] = useState(null);
    const [flowData, setFlowData] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState({ revenue: false, load: false, efficiency: false });
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedChart, setHighlightedChart] = useState(null);

    // Chart Refs
    const throughputRef = useRef(null);
    const revenueRef = useRef(null);
    const loadRef = useRef(null);
    const efficiencyRef = useRef(null);

    const chartOptions = [
        { name: 'Patient Throughput', ref: throughputRef },
        { name: 'Revenue Contribution', ref: revenueRef },
        { name: 'Department Load Balance', ref: loadRef },
        { name: 'Operational Earning Efficiency', ref: efficiencyRef }
    ];

    const toggleInsight = (key) => setInsights(prev => ({ ...prev, [key]: !prev[key] }));

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const scrollToChart = (chart) => {
        if (chart.ref.current) {
            chart.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedChart(chart.name);
            setSearchQuery('');
            setTimeout(() => setHighlightedChart(null), 3000);
        }
    };

    const filteredCharts = searchQuery 
        ? chartOptions.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, flowRes, revRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/stats`),
                    fetch(`${API_BASE}/analytics/patient-flow`),
                    fetch(`${API_BASE}/analytics/dashboard-summary`)
                ]);
                setStats(await statsRes.json());
                const fData = await flowRes.json();
                
                const mappedFlow = fData.labels.map((label, i) => ({
                    name: label,
                    admissions: fData.datasets[0].data[i],
                    discharges: fData.datasets[1].data[i]
                }));
                
                setFlowData(mappedFlow);
                setRevenueData(await revRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Syncing Clinical Intelligence...</div>;
    if (!stats || !revenueData) return <div className="error-screen">Database Offline. Please check backend.</div>;

    const alerts = revenueData.keyAlerts || [];

    // Doctor-specific overrides for KPIs
    const isDoctor = user?.role === 'Doctor' || user?.role === 'doctor';
    const patientsThisMonth = isDoctor ? user?.stats?.patientsMonth : stats.totalPatients;
    const waitTime = isDoctor ? Number(user?.stats?.avgTreatmentTime) : stats.avgWaitTime;
    const efficiency = isDoctor ? user?.stats?.efficiencyScore : stats.satisfactionScore;

    return (
        <div className="dashboard-root-v2">
            <div className="dashboard-container">
                {/* Header Section */}
                <div className="dashboard-header">
                    <div className="header-titles">
                        <h1 className="header-h1">Welcome back, {user?.name || 'Administrator'}</h1>
                        <p className="header-p">
                            {isDoctor 
                                ? `Personal clinical insights for ${user?.department} department.`
                                : "Aggregated operational metrics from 10,000+ local records."}
                        </p>
                    </div>

                    <div className="header-search-container">
                        <div className="header-search-bar">
                            <Search size={18} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Search clinical charts..." 
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            {searchQuery && <X size={16} className="search-clear" onClick={() => setSearchQuery('')} />}
                        </div>
                        {filteredCharts.length > 0 && (
                            <div className="search-results-dropdown">
                                {filteredCharts.map((chart, i) => (
                                    <div key={i} className="search-result-item" onClick={() => scrollToChart(chart)}>
                                        <div className="result-dot"></div>
                                        {chart.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="header-status">
                        <ShieldCheck size={18} color="#7a9e87" />
                        <span className="status-text">Clinical Data Verified</span>
                    </div>
                </div>

                {/* Key Alerts Row (Derived from Insights) */}
                <div className="alerts-row-v2">
                    <div className="alerts-row-header">
                        <Bell size={18} className="alerts-bell" />
                        <span className="alerts-row-label">Operational Signals & Alerts</span>
                    </div>
                    <div className="alerts-flex">
                        {alerts.map((alert, i) => (
                            <AlertCard key={i} {...alert} />
                        ))}
                    </div>
                </div>

                {/* KPI Row */}
                <div className="kpi-grid">
                    <StatCard 
                        label={isDoctor ? "Personal Patients" : "Total Patients"} 
                        value={patientsThisMonth} 
                        icon={<Users size={20}/>} 
                        unit="" 
                        color={SOFT_COLORS.primary} 
                    />
                    <StatCard 
                        label={isDoctor ? "Avg Treatment" : "Avg Wait Time"} 
                        value={waitTime} 
                        unit="m" 
                        icon={<Clock size={20}/>} 
                        color={SOFT_COLORS.secondary} 
                    />
                    <StatCard 
                        label="ICU Occupancy" 
                        value={stats.icuOccupancy} 
                        unit="%" 
                        progress={stats.icuOccupancy/100} 
                        color={SOFT_COLORS.accent} 
                    />
                    <StatCard 
                        label={isDoctor ? "Clinical Efficiency" : "Satisfaction Score"} 
                        value={efficiency} 
                        unit="%" 
                        progress={efficiency/100} 
                        color={SOFT_COLORS.success} 
                    />
                </div>

                {/* Grid Row 1 */}
                <div className="charts-grid-v2">
                    {/* Throughput */}
                    <div 
                        id="admission-discharge"
                        ref={throughputRef}
                        className={`chart-card-v2 ${highlightedChart === 'Patient Throughput' ? 'highlight-focus' : ''}`}
                    >
                        <div className="card-header-flex">
                            <div>
                                <h3 className="card-h3">Patient Throughput</h3>
                                <p className="card-p">Admission vs Discharge tracking (Last 7 Days).</p>
                            </div>
                            <TrendingUp size={20} style={{ color: SOFT_COLORS.secondary, opacity: 0.6 }} />
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <ComposedChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorAdm" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={SOFT_COLORS.primary} stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor={SOFT_COLORS.primary} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0ee" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" />
                                    <Area type="monotone" dataKey="admissions" name="Admissions" stroke={SOFT_COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorAdm)" dot={{ r: 4, fill: SOFT_COLORS.primary, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="discharges" name="Discharges" stroke={SOFT_COLORS.muted} strokeWidth={2} strokeDasharray="5 5" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Donut */}
                    <div 
                        id="revenue-contribution"
                        ref={revenueRef}
                        className={`chart-card-v2 ${highlightedChart === 'Revenue Contribution' ? 'highlight-focus' : ''}`}
                    >
                        <div className="card-header-flex">
                            <div>
                                <h3 className="card-h3">Revenue Contribution</h3>
                                <p className="card-p">Departmental share of total hospital income.</p>
                            </div>
                            <button className="insight-trigger" onClick={() => toggleInsight('revenue')}>
                                <Lightbulb size={16} /> Reveal Insight
                            </button>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={revenueData.revenueByDepartment}
                                        cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                                        paddingAngle={5} dataKey="revenue" nameKey="department" stroke="none"
                                    >
                                        {revenueData.revenueByDepartment.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {insights.revenue && (
                            <div className="dashboard-insight-panel active">
                                <PieIcon size={16} className="insight-icon" />
                                <span>Donut chart shows that <strong>ICU and Surgery</strong> contribute the largest share of revenue, making them key financial drivers.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Row 2 */}
                <div className="charts-grid-v2">
                    {/* Department Load Balance (New) */}
                    <div 
                        id="dept-load"
                        ref={loadRef}
                        className={`chart-card-v2 ${highlightedChart === 'Department Load Balance' ? 'highlight-focus' : ''}`}
                    >
                        <div className="card-header-flex">
                            <div>
                                <h3 className="card-h3">Department Load Balance</h3>
                                <p className="card-p">Patient count vs total bed capacity metrics.</p>
                            </div>
                            <button className="insight-trigger" onClick={() => toggleInsight('load')}>
                                <Lightbulb size={16} /> Reveal Balance Insight
                            </button>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart data={revenueData.loadBalance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0ee" />
                                    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" />
                                    <Bar dataKey="patients" name="Patient Count" fill={SOFT_COLORS.accent} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="beds" name="Total Beds" fill={SOFT_COLORS.highlight} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {insights.load && (
                            <div className="dashboard-insight-panel active">
                                <Layers size={16} className="insight-icon" />
                                <span>Certain departments handle more patients despite limited beds, indicating <strong>uneven load distribution</strong>.</span>
                            </div>
                        )}
                    </div>

                    {/* Revenue vs Patient Volume (New) */}
                    <div 
                        id="earning-efficiency"
                        ref={efficiencyRef}
                        className={`chart-card-v2 ${highlightedChart === 'Operational Earning Efficiency' ? 'highlight-focus' : ''}`}
                    >
                        <div className="card-header-flex">
                            <div>
                                <h3 className="card-h3">Operational Earning Efficiency</h3>
                                <p className="card-p">Revenue generation vs total volume per department.</p>
                            </div>
                            <button className="insight-trigger" onClick={() => toggleInsight('efficiency')}>
                                <Lightbulb size={16} /> Reveal Efficiency Insight
                            </button>
                        </div>
                        <div style={{ width: '100%', height: 260 }}>
                            <ResponsiveContainer>
                                <BarChart data={revenueData.revenueEfficiency} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0ee" />
                                    <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `₹${(v/1e6).toFixed(1)}M`} />
                                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                    <RechartsTooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" />
                                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill={SOFT_COLORS.primary} radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="patients" name="Patient Volume" fill={SOFT_COLORS.muted} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        {insights.efficiency && (
                            <div className="dashboard-insight-panel active">
                                <DollarSign size={16} className="insight-icon" />
                                <span>Some departments generate <strong>higher revenue with fewer patients</strong>, indicating higher value treatments compared to high-volume units.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
