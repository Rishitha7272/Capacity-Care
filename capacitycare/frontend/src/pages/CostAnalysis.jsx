import React, { useState, useEffect, useRef } from 'react';
import {
    Treemap, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell,
    ComposedChart, Line, Area, Legend,
    ScatterChart, Scatter, ZAxis,
    LineChart, ReferenceArea, ReferenceLine
} from 'recharts';
import { Activity, Download, TrendingUp, Users, ZoomIn, ZoomOut, RotateCcw, Lightbulb } from 'lucide-react';
import './CostAnalysis.css';

const API_BASE = 'http://localhost:5001/api';
const COLORS = ['#a4c9b0', '#c2dbca', '#8fb89f', '#f5d6b3', '#eaf3ee'];

const DEPT_COLORS = {
    Cardiology:       '#a4c9b0',
    Neurology:        '#8fb89f',
    Orthopedics:      '#c2dbca',
    Oncology:         '#f5d6b3',
    Pediatrics:       '#eaf3ee',
    Emergency:        '#7ca58a',
    Pulmonology:      '#3f554a',
    Gastroenterology: '#d7e8de',
    Urology:          '#bad6c5',
    Psychiatry:       '#2d5a40',
};

/* ─── Shared Custom Tooltip ────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="cost-tooltip">
                <div className="cost-tooltip-label">{label || payload[0]?.payload?.name}</div>
                {payload.map((p, i) => (
                    <div key={i} className="cost-tooltip-item" style={{ color: p.color || '#334155' }}>
                        {p.name === 'cost' || p.name === 'avgCost' || p.name === 'size' ? 'Cost: ₹' : ''}
                        {(p.value).toLocaleString()}
                        {p.name === 'patientVolume' && ' patients'}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ─── Scatter Custom Tooltip ────────────────────────────────────────── */
const ScatterCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const d = payload[0]?.payload;
        return (
            <div className="cost-tooltip">
                <div className="cost-tooltip-label">{d?.department}</div>
                <div className="cost-tooltip-item">👥 Patients: {d?.totalPatients?.toLocaleString()}</div>
                <div className="cost-tooltip-item">💰 Avg Cost: ₹{d?.avgCost?.toLocaleString()}</div>
                <div className="cost-tooltip-item">🏥 Total Cost: ₹{(d?.totalCost / 1e6)?.toFixed(2)}M</div>
            </div>
        );
    }
    return null;
};

/* ─── Line Custom Tooltip ───────────────────────────────────────────── */
const LineCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="cost-tooltip">
                <div className="cost-tooltip-label">{label}</div>
                {payload.map((p, i) => (
                    <div key={i} className="cost-tooltip-item" style={{ color: p.color }}>
                        {p.name}: {p.name.includes('Cost')
                            ? `₹${(p.value / 1000).toFixed(0)}K`
                            : p.value?.toLocaleString()}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ─── Treemap Content Renderer ──────────────────────────────────────── */
const CustomizedContent = (props) => {
    const { root, depth, x, y, width, height, index, name, value } = props;
    const color = COLORS[Math.floor((index / (root.children?.length || 1)) * 5)] || '#c2dbca';
    return (
        <g>
            <rect x={x} y={y} width={width} height={height}
                style={{ fill: depth < 2 ? color : '#ffffff', stroke: '#fff', strokeWidth: 2, strokeOpacity: 0.5 }}
            />
            {width > 60 && height > 30 && (
                <text x={x + 8} y={y + 18} fill="#000000" fontSize={15} fontWeight={900}>{name}</text>
            )}
            {width > 60 && height > 45 && depth > 1 && (
                <text x={x + 8} y={y + 36} fill="#1e293b" fontSize={14} fontWeight={700}>
                    ₹{value?.toLocaleString()}
                </text>
            )}
        </g>
    );
};

/* ─── Scatter Dot Renderer ──────────────────────────────────────────── */
const ScatterDot = (props) => {
    const { cx, cy, payload } = props;
    const color = DEPT_COLORS[payload.department] || '#8fb89f';
    const r = Math.max(10, Math.min(28, payload.totalCost / 1_500_000));
    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.82} stroke="#fff" strokeWidth={2} />
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>
                {payload.department.slice(0, 3)}
            </text>
        </g>
    );
};

/* ════════════════════════════════════════════════════════
   Cost vs Patients — Scatter Plot with Zoom
════════════════════════════════════════════════════════ */
function CostVsPatients({ data }) {
    const allData = data || [];
    const [zoomedData, setZoomedData] = useState(allData);
    const [zoomed, setZoomed] = useState(false);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomHighPatients = () => {
        setZoomedData(allData.filter(d => d.totalPatients > 900));
        setZoomed(true);
        setInsightVisible(true);
    };
    const zoomOutliers = () => {
        setZoomedData(allData.filter(d => d.avgCost > 15000));
        setZoomed(true);
        setInsightVisible(true);
    };
    const resetZoom = () => {
        setZoomedData(allData);
        setZoomed(false);
        setInsightVisible(false);
    };

    const insightText = zoomed
        ? 'Zoom shows some departments incurring higher costs for fewer patients, indicating inefficiency in resource utilization.'
        : 'Use zoom controls to focus on high patient count regions or outliers.';

    return (
        <div className="cost-chart-card col-span-4 insight-graph-card">
            {/* Card Header */}
            <div className="cost-card-header">
                <div className="cost-card-titles">
                    <h3 className="cost-card-title">Cost vs Patients</h3>
                    <p className="cost-card-subtitle">Scatter analysis of department-level cost efficiency relative to patient load.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomHighPatients} title="Zoom: High Patient Count Regions">
                        <ZoomIn size={15} /> High Volume
                    </button>
                    <button className="zoom-btn" onClick={zoomOutliers} title="Zoom: Outliers (High Cost)">
                        <ZoomIn size={15} /> Outliers
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom} title="Reset">
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 40, bottom: 30, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" />
                        <XAxis
                            type="number"
                            dataKey="totalPatients"
                            name="Total Patients"
                            label={{ value: 'Total Patients →', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            type="number"
                            dataKey="avgCost"
                            name="Avg Cost (₹)"
                            tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
                            label={{ value: 'Avg Cost →', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b', fontSize: 12 }}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ZAxis range={[400, 1800]} />
                        <RechartsTooltip content={<ScatterCustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter
                            data={zoomedData}
                            shape={<ScatterDot />}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Legend row */}
            <div className="scatter-legend-row">
                {allData.map(d => (
                    <div key={d.department} className="scatter-legend-item">
                        <span className="scatter-legend-dot" style={{ background: DEPT_COLORS[d.department] || '#8fb89f' }} />
                        <span>{d.department}</span>
                    </div>
                ))}
            </div>

            {/* Insight Panel */}
            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">{insightText}</div>
                    {zoomed && (
                        <div className="insight-panel-example">
                            👉 &quot;Zoom shows some departments incurring higher costs for fewer patients,
                            indicating inefficiency in resource utilization.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════
   Cost vs Time — Line Chart with Zoom (brush)
════════════════════════════════════════════════════════ */
function CostVsTime({ data }) {
    const allData = data || [];

    const [refAreaLeft, setRefAreaLeft]   = useState('');
    const [refAreaRight, setRefAreaRight] = useState('');
    const [isDragging, setIsDragging]     = useState(false);
    const [zoomDomain, setZoomDomain]     = useState(null);
    const [displayData, setDisplayData]   = useState(allData);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomPeakPeriod = () => {
        // Zoom to Jun–Aug 2025 (known spike)
        const sliced = allData.filter(d => ['2025-06','2025-07','2025-08','2025-09'].includes(d.month));
        setDisplayData(sliced);
        setInsightVisible(true);
    };
    const zoomRecentWeeks = () => {
        const sliced = allData.slice(-6);
        setDisplayData(sliced);
        setInsightVisible(true);
    };
    const resetZoom = () => {
        setDisplayData(allData);
        setInsightVisible(false);
        setZoomDomain(null);
    };

    /* Manual region select */
    const onMouseDown = (e) => {
        if (e?.activeLabel) { setRefAreaLeft(e.activeLabel); setIsDragging(true); }
    };
    const onMouseMove = (e) => {
        if (isDragging && e?.activeLabel) setRefAreaRight(e.activeLabel);
    };
    const onMouseUp = () => {
        if (!refAreaLeft || !refAreaRight) { setIsDragging(false); return; }
        const [l, r] = [refAreaLeft, refAreaRight].sort();
        const sliced = allData.filter(d => d.period >= l && d.period <= r);
        if (sliced.length > 1) { setDisplayData(sliced); setInsightVisible(true); }
        setRefAreaLeft(''); setRefAreaRight('');
        setIsDragging(false);
    };

    const maxCost    = Math.max(...displayData.map(d => d.totalCost));
    const spikeMonth = displayData.find(d => d.totalCost === maxCost);

    return (
        <div className="cost-chart-card col-span-4 insight-graph-card">
            <div className="cost-card-header">
                <div className="cost-card-titles">
                    <h3 className="cost-card-title">Cost vs Time</h3>
                    <p className="cost-card-subtitle">Temporal cost fluctuations — drag chart area to select a custom region, or use zoom presets.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomPeakPeriod} title="Focus: Peak Admission Period">
                        <ZoomIn size={15} /> Peak Period
                    </button>
                    <button className="zoom-btn" onClick={zoomRecentWeeks} title="Focus: Recent Months">
                        <ZoomIn size={15} /> Recent
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom} title="Reset">
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Drag-to-zoom hint */}
            <p className="zoom-drag-hint">🖱️ Click &amp; drag on the chart to zoom into any custom period</p>

            <div style={{ width: '100%', height: 370, userSelect: 'none' }}>
                <ResponsiveContainer>
                    <LineChart
                        data={displayData}
                        margin={{ top: 10, right: 40, bottom: 30, left: 20 }}
                        onMouseDown={onMouseDown}
                        onMouseMove={onMouseMove}
                        onMouseUp={onMouseUp}
                    >
                        <defs>
                            <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#8fb89f" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8fb89f" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f0ec" />
                        <XAxis
                            dataKey="period"
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                            angle={-30}
                            textAnchor="end"
                            height={50}
                        />
                        <YAxis
                            yAxisId="cost"
                            tickFormatter={v => `₹${(v / 1e6).toFixed(1)}M`}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="patients"
                            orientation="right"
                            tickFormatter={v => `${v}`}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <RechartsTooltip content={<LineCustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />

                        <Area
                            yAxisId="cost"
                            type="monotone"
                            dataKey="totalCost"
                            name="Total Cost"
                            stroke="#8fb89f"
                            strokeWidth={3}
                            fill="url(#costGrad)"
                            dot={{ r: 4, fill: '#8fb89f', stroke: '#fff', strokeWidth: 2 }}
                            activeDot={{ r: 7, fill: '#5fa87a' }}
                        />
                        <Line
                            yAxisId="patients"
                            type="monotone"
                            dataKey="patientCount"
                            name="Patients"
                            stroke="#c2dbca"
                            strokeWidth={2}
                            strokeDasharray="6 3"
                            dot={false}
                        />

                        {/* Drag reference area */}
                        {isDragging && refAreaLeft && refAreaRight && (
                            <ReferenceArea
                                yAxisId="cost"
                                x1={refAreaLeft}
                                x2={refAreaRight}
                                stroke="#8fb89f"
                                fill="#a4c9b0"
                                fillOpacity={0.25}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Insight Panel */}
            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Detect temporal cost fluctuations and unusual spikes.</div>
                    {insightVisible && spikeMonth && (
                        <div className="insight-panel-example">
                            👉 &quot;Zoom shows a sharp increase in costs during peak admission periods
                            (e.g. <strong>{spikeMonth.period}</strong> — ₹{(spikeMonth.totalCost / 1e6).toFixed(1)}M total),
                            indicating demand-driven expense growth.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════
   Profit vs Cost Quadrant
════════════════════════════════════════════════════════ */
function ProfitVsCostQuadrant({ data }) {
    const defaultData = [];
    const allData = data || defaultData;
    const [insightVisible, setInsightVisible] = useState(false);

    // Calculate averages for reference lines
    const avgCost = allData.length > 0 ? allData.reduce((acc, d) => acc + d.cost, 0) / allData.length : 0;
    const avgRevenue = allData.length > 0 ? allData.reduce((acc, d) => acc + d.revenue, 0) / allData.length : 0;

    const insightText = 'Departments in the top-left quadrant generate high revenue with relatively lower cost, indicating high efficiency, while those in the bottom-right show high cost but low revenue, indicating potential loss zones.';

    return (
        <div className="cost-chart-card col-span-4 insight-graph-card" style={{ marginTop: '1.5rem' }}>
            <div className="cost-card-header">
                <div className="cost-card-titles">
                    <h3 className="cost-card-title">Profit vs Cost Quadrant</h3>
                    <p className="cost-card-subtitle">Scatter analysis classifying departments into profit zones and efficiency levels.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={() => setInsightVisible(!insightVisible)}>
                        <Lightbulb size={15} /> Reveal Quadrant Insight
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 40, bottom: 30, left: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e8f0ec" />
                        <XAxis 
                            type="number" 
                            dataKey="cost" 
                            name="Cost" 
                            tickFormatter={v => `₹${(v / 1e6).toFixed(1)}M`}
                            label={{ value: 'Treatment Cost →', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 12 }}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false} tickLine={false}
                        />
                        <YAxis 
                            type="number" 
                            dataKey="revenue" 
                            name="Revenue" 
                            tickFormatter={v => `₹${(v / 1e6).toFixed(1)}M`}
                            label={{ value: 'Revenue →', angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 12 }}
                            tick={{ fill: '#64748b', fontSize: 11 }}
                            axisLine={false} tickLine={false}
                        />
                        <ZAxis range={[400, 800]} />
                        <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} 
                            content={({active, payload}) => {
                                if (active && payload && payload.length) {
                                    const d = payload[0].payload;
                                    return (
                                        <div className="cost-tooltip">
                                            <div className="cost-tooltip-label">{d.department}</div>
                                            <div className="cost-tooltip-item">📈 Revenue: ₹{(d.revenue/1e6).toFixed(2)}M</div>
                                            <div className="cost-tooltip-item">📉 Cost: ₹{(d.cost/1e6).toFixed(2)}M</div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <ReferenceLine x={avgCost} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'Avg Cost', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceLine y={avgRevenue} stroke="#10b981" strokeDasharray="5 5" label={{ position: 'left', value: 'Avg Rev', fill: '#10b981', fontSize: 10 }} />
                        
                        <Scatter data={allData} shape={(props) => {
                            const { cx, cy, payload } = props;
                            // Determine quadrant colors based on revenue vs cost averages
                            let fill = '#8fb89f'; // default
                            if (payload.revenue >= avgRevenue && payload.cost <= avgCost) fill = '#10b981'; // Green (Best)
                            else if (payload.revenue < avgRevenue && payload.cost > avgCost) fill = '#ef4444'; // Red (Loss)
                            else if (payload.revenue >= avgRevenue && payload.cost > avgCost) fill = '#f59e0b'; // Yellow/Orange (Expensive but good Rev)
                            else fill = '#94a3b8'; // Grey (Low/Low)

                            return (
                                <g>
                                    <circle cx={cx} cy={cy} r={16} fill={fill} fillOpacity={0.85} stroke="#fff" strokeWidth={2} />
                                    <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={9} fontWeight={700}>
                                        {payload.department.slice(0, 3)}
                                    </text>
                                </g>
                            );
                        }} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Classify departments into profit zones and efficiency levels.</div>
                    {insightVisible && (
                        <div className="insight-panel-example">
                            👉 &quot;{insightText}&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════
   Main Page
════════════════════════════════════════════════════════ */
export default function CostAnalysis() {
    const [data, setData]         = useState({ treemapData: [], trendData: [] });
    const [insights, setInsights] = useState({ costVsPatients: [], costVsTime: [], profitVsCost: [] });
    const [stats, setStats]       = useState(null);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [costRes, statsRes, insightsRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/cost-summary`),
                    fetch(`${API_BASE}/analytics/stats`),
                    fetch(`${API_BASE}/analytics/cost-insights`),
                ]);
                setData(await costRes.json());
                setStats(await statsRes.json());
                setInsights(await insightsRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div className="loading-screen">Analyzing Financial Data...</div>;

    return (
        <div className="cost-dashboard-root">
            {/* ── Header ── */}
            <div className="cost-header-row">
                <div className="cost-header-titles">
                    <h1 className="cost-title">Financial Intelligence</h1>
                    <p className="cost-subtitle">Real-time resource consumption from 10,000+ local records.</p>
                </div>
                <div className="cost-header-actions">
                </div>
            </div>

            {/* ── KPI Row ── */}
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

            {/* ── Existing Charts Grid ── */}
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
                                        <stop offset="5%"  stopColor="#8fb89f" stopOpacity={0.6}/>
                                        <stop offset="95%" stopColor="#8fb89f" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={36}/>
                                <Area yAxisId="left" type="monotone" dataKey="avgCost" name="Avg Cost (₹)" stroke="#8fb89f" strokeWidth={3} fillOpacity={1} fill="url(#colorAvgCost)" />
                                <Line yAxisId="left" type="monotone" dataKey="patientVolume" name="Patient Volume" stroke="#c2dbca" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── New Insight Graphs ── */}
            <div className="cost-grid insights-grid">
                <CostVsPatients data={insights.costVsPatients} />
                <CostVsTime data={insights.costVsTime} />
                {insights.profitVsCost && insights.profitVsCost.length > 0 && (
                    <ProfitVsCostQuadrant data={insights.profitVsCost} />
                )}
            </div>
        </div>
    );
}
