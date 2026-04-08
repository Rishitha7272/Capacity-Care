import React, { useState, useEffect, useMemo } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, 
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
    ResponsiveContainer, Legend, ScatterChart, Scatter, 
    ZAxis, Cell, ComposedChart, Sankey
} from 'recharts';
import { 
    Users, Clock, AlertTriangle, ArrowUpRight, 
    Maximize2, Filter, Calendar, ZoomIn, RotateCcw, Lightbulb 
} from 'lucide-react';
import './PatientFlow.css';

const API_BASE = 'http://localhost:5001/api';

/* ─── Shared Tooltip ──────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="flow-tooltip">
                <div className="flow-tooltip-label">{label || payload[0]?.payload?.name}</div>
                {payload.map((p, i) => (
                    <div key={i} className="flow-tooltip-item" style={{ color: p.color || p.fill || '#3f554a' }}>
                        {p.name}: {p.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

/* ─── Heatmap / Scatter Tooltip ────────────────────────────────────── */
const HeatmapTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="flow-tooltip">
                <div className="flow-tooltip-label">{d.dept} @ {d.time}</div>
                <div className="flow-tooltip-item" style={{ color: '#3f554a' }}>
                    Patient Inflow: {d.value}
                </div>
            </div>
        );
    }
    return null;
};

/* ─── Heatmap Dot Renderer ─────────────────────────────────────────── */
const HeatmapDot = (props) => {
    const { cx, cy, payload } = props;
    const size = 35;
    const val = payload.value;
    
    // Gradient filling based on value (Tranquil Earth palette)
    let fill = '#eaf3ee'; 
    if (val > 150) fill = '#3f554a';
    else if (val > 100) fill = '#7ca58a';
    else if (val > 50) fill = '#a4c9b0';
    
    return (
        <g>
            <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} fill={fill} rx={6} stroke="#fff" strokeWidth={1} />
            <text x={cx} y={cy + 4} textAnchor="middle" fill={val > 100 ? '#ffffff' : '#1a221f'} fontSize={11} fontWeight={600}>
                {val}
            </text>
        </g>
    );
};

/* ════════════════════════════════════════════════════════
   Patient Flow Heatmap (Department vs Time)
════════════════════════════════════════════════════════ */
function PatientFlowHeatmap({ data }) {
    const allData = data || [];
    const [displayData, setDisplayData] = useState(allData);
    const [zoomed, setZoomed] = useState(false);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomPeakHours = () => {
        setDisplayData(allData.filter(d => d.time === '16:00' || d.time === '18:00' || d.time === '20:00'));
        setZoomed(true);
        setInsightVisible(true);
    };
    
    const zoomEmergency = () => {
        setDisplayData(allData.filter(d => d.dept === 'Emergency'));
        setZoomed(true);
        setInsightVisible(true);
    };

    const resetZoom = () => {
        setDisplayData(allData);
        setZoomed(false);
        setInsightVisible(false);
    };

    const insightText = zoomed 
        ? 'Zoom shows heavy patient inflow in Emergency during evening hours, indicating peak congestion periods.'
        : 'Use zoom controls to focus on specific time slots or high inflow departments.';

    // Create unique sets for axes
    const times = [...new Set(allData.map(d => d.time))];

    return (
        <div id="flow-heatmap" className="flow-chart-card col-span-4 insight-graph-card">
            <div className="flow-card-header">
                <div className="flow-card-titles">
                    <h3 className="flow-card-title">Patient Flow Heatmap</h3>
                    <p className="flow-card-subtitle">Departmental congestion analysis across specific time slots.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomPeakHours}>
                        <ZoomIn size={15} /> Peak Hours
                    </button>
                    <button className="zoom-btn" onClick={zoomEmergency}>
                        <ZoomIn size={15} /> Emergency Dept
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom}>
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 380 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="time" 
                            type="category" 
                            allowDuplicatedCategory={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                        />
                        <YAxis 
                            dataKey="dept" 
                            type="category" 
                            allowDuplicatedCategory={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            axisLine={false} 
                            tickLine={false} 
                            width={100}
                        />
                        <ZAxis range={[1000, 1000]} />
                        <RechartsTooltip content={<HeatmapTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={displayData} shape={<HeatmapDot />} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Identify peak flow timings and congestion points.</div>
                    {zoomed && (
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
   Patient Transfer Flow (Sankey)
════════════════════════════════════════════════════════ */
function PatientTransferFlow({ data }) {
    const defaultData = { nodes: [], links: [] };
    const allData = data || defaultData;
    const [displayData, setDisplayData] = useState(allData);
    const [zoomed, setZoomed] = useState(false);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomEmergencyToIcu = () => {
        // filter critical paths originating heavily from emergency
        const zoomedLinks = allData.links.filter(l => l.value > 100);
        setDisplayData({ nodes: allData.nodes, links: zoomedLinks });
        setZoomed(true);
        setInsightVisible(true);
    };

    const resetZoom = () => {
        setDisplayData(allData);
        setZoomed(false);
        setInsightVisible(false);
    };

    const insightText = zoomed
        ? 'Zoom shows most patients moving from Emergency to ICU or General Ward, indicating critical case escalation patterns.'
        : 'Use zoom controls to focus on major patient movement paths and high transfer routes.';

    return (
        <div id="transfer-flow" className="flow-chart-card col-span-4 insight-graph-card">
            <div className="flow-card-header">
                <div className="flow-card-titles">
                    <h3 className="flow-card-title">Patient Transfer Flow</h3>
                    <p className="flow-card-subtitle">Volume and paths of patient transfers between internal departments.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomEmergencyToIcu}>
                        <ZoomIn size={15} /> High Transfer Routes
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom}>
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 380 }}>
                {displayData.nodes.length > 0 && (
                    <ResponsiveContainer>
                        <Sankey
                            data={displayData}
                            nodePadding={50}
                            margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                            link={{ stroke: '#a4c9b0', strokeOpacity: 0.3 }}
                            node={{ fill: '#3f554a' }}
                        >
                            <RechartsTooltip />
                        </Sankey>
                    </ResponsiveContainer>
                )}
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Understand how patients move between departments.</div>
                    {zoomed && (
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
   Main Component Page
════════════════════════════════════════════════════════ */
export default function PatientFlow() {
    const [timeRange, setTimeRange] = useState('7d');
    const [flowData, setFlowData] = useState(null);
    const [deptData, setDeptData] = useState([]);
    const [advancedData, setAdvancedData] = useState({ heatmap: [], sankey: { nodes: [], links: [] } });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlow = async () => {
            setLoading(true);
            try {
                const [flowRes, deptRes, advRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/patient-flow?range=${timeRange}`),
                    fetch(`${API_BASE}/analytics/departments`),
                    fetch(`${API_BASE}/analytics/patient-flow-advanced`)
                ]);
                setFlowData(await flowRes.json());
                setDeptData(await deptRes.json());
                setAdvancedData(await advRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFlow();
    }, [timeRange]);

    if (loading) return <div className="loading-screen">Analyzing Patient Flow...</div>;

    return (
        <div className="flow-dashboard-root">
            {/* Header row */}
            <div className="flow-header-row">
                <div className="flow-header-titles">
                    <h1 className="flow-title">Patient Flow & Workload</h1>
                    <p className="flow-subtitle">Predictive analytics derived from original local dataset of 10,000+ records.</p>
                </div>
            </div>

            {/* Existing Filters element */}
            <div className="flow-filters-bar">
                <div className="filter-group">
                    <Calendar size={18} className="filter-label" />
                    <span className="filter-label">Time Range</span>
                    <select className="filter-select" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                        <option value="7d">Last 7 Days</option>
                        <option value="1m">Last 1 Month</option>
                        <option value="6m">Last 6 Months</option>
                        <option value="1y">Last 1 Year</option>
                    </select>
                </div>
            </div>

            <div className="flow-grid">
                {/* Regular charts */}
                <div id="admission-discharge-flow" className="flow-chart-card col-span-4">
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

                <div id="dept-load-status" className="flow-chart-card col-span-4">
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

                <div id="staff-efficiency" className="flow-chart-card col-span-4">
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
                                <Bar dataKey="staffOnDuty" name="Staff on Duty" fill="#7ca58a" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Advanced Flow Components */}
                <PatientFlowHeatmap data={advancedData.heatmap} />
                <PatientTransferFlow data={advancedData.sankey} />
            </div>
        </div>
    );
}
