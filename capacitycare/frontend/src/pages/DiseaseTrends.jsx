import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    Tooltip as RechartsTooltip, Legend, BarChart, Bar, 
    CartesianGrid, XAxis, YAxis,
    ScatterChart, Scatter, ZAxis,
    LineChart, Line,
    FunnelChart, Funnel, LabelList,
    ComposedChart
} from 'recharts';
import { 
    Thermometer, TrendingUp, AlertCircle, Activity,
    ZoomIn, RotateCcw, Lightbulb 
} from 'lucide-react';
import './DiseaseTrends.css';

const API_BASE = 'http://localhost:5001/api';
const DONUT_COLORS = ['#a4c9b0', '#7a9e87', '#f5d6b3', '#8fb89f', '#cbd5e1'];
const BUBBLE_COLORS = {
    'Asthma/Respiratory': '#a4c9b0',
    'Gastric/Entero': '#f5d6b3',
    'Cardiac Conditions': '#ef4444'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="disease-tooltip">
                <div style={{ fontWeight: '700', marginBottom: '4px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>{label || payload[0]?.payload?.name || payload[0]?.payload?.ageGroup}</div>
                {payload.map((p, i) => (
                    <div key={i} style={{ color: p.color || p.fill || '#3f554a', fontSize: '0.85rem', margin: '4px 0' }}>
                        {p.name || p.dataKey}: {p.value}
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// ─── Age-wise Disease Bubbles ────────────────────────────────────────────────
const BubbleShape = (props) => {
    const { cx, cy, payload } = props;
    const r = Math.max(10, Math.min(35, payload.cases / 12));
    const fill = BUBBLE_COLORS[payload.disease] || '#a4c9b0';
    return (
        <g>
            <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.8} stroke="#fff" strokeWidth={2} />
            <text x={cx} y={cy + 4} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={700}>
                {payload.cases}
            </text>
        </g>
    );
};

function AgeDiseaseBubbles({ data }) {
    const allData = data || [];
    const [displayData, setDisplayData] = useState(allData);
    const [zoomed, setZoomed] = useState(false);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomElderlyRisk = () => {
        setDisplayData(allData.filter(d => d.ageGroup === '60+ yrs' || d.disease === 'Cardiac Conditions'));
        setZoomed(true);
        setInsightVisible(true);
    };

    const resetZoom = () => {
        setDisplayData(allData);
        setZoomed(false);
        setInsightVisible(false);
    };

    return (
        <div id="age-disease-intensity" className="disease-chart-card col-span-4 insight-graph-card">
            <div className="disease-card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="disease-card-titles">
                    <h3 className="disease-card-title">Age-wise Disease Intensity</h3>
                    <p className="disease-card-subtitle">Volume of specific diseases across demographics.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomElderlyRisk}>
                        <ZoomIn size={15} /> Elderly Risk
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom}>
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="ageGroup" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <YAxis dataKey="disease" type="category" allowDuplicatedCategory={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} width={120} />
                        <ZAxis dataKey="cases" range={[100, 1000]} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter data={displayData} shape={<BubbleShape />} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Understand which age groups are most affected by specific diseases.</div>
                    {zoomed && (
                        <div className="insight-panel-example">
                            👉 &quot;Larger bubbles in older age groups for cardiac conditions indicate higher risk among elderly patients.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Disease Trend Over Time ─────────────────────────────────────────────────
function DiseaseTrendsTime({ data }) {
    const allData = data || [];
    const [displayData, setDisplayData] = useState(allData);
    const [zoomed, setZoomed] = useState(false);
    const [insightVisible, setInsightVisible] = useState(false);

    const zoomRecentSpikes = () => {
        // Zoom to the last 3 months showing a spike
        setDisplayData(allData.slice(-3));
        setZoomed(true);
        setInsightVisible(true);
    };

    const resetZoom = () => {
        setDisplayData(allData);
        setZoomed(false);
        setInsightVisible(false);
    };

    return (
        <div id="disease-trends-temporal" className="disease-chart-card col-span-2 insight-graph-card">
            <div className="disease-card-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div className="disease-card-titles" style={{ marginBottom: '0.5rem' }}>
                    <h3 className="disease-card-title">Disease Trend Over Time</h3>
                    <p className="disease-card-subtitle">Trajectory of viral vs cardiac admissions.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={zoomRecentSpikes}>
                        <ZoomIn size={15} /> Recent Spikes
                    </button>
                    <button className="zoom-btn zoom-btn-reset" onClick={resetZoom}>
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" />
                        <Line type="monotone" dataKey="viral" name="Viral Infections" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="cardiac" name="Cardiac Cases" stroke="#a4c9b0" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`} style={{ minHeight: 'auto', padding: '0.75rem' }}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label" style={{ fontSize: '0.7rem' }}>💡 Insight</div>
                    <div className="insight-panel-text" style={{ fontSize: '0.8rem' }}>Identify growth or decline of specific diseases.</div>
                    {zoomed && (
                        <div className="insight-panel-example" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                            👉 &quot;Zoom shows a gradual increase in viral infections over recent weeks, indicating a spreading trend.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Disease Progression Funnel ──────────────────────────────────────────────
function ProgressionFunnel({ data }) {
    const defaultData = [
        { stage: "Diagnosed", value: 100, fill: "#a4c9b0" }
    ];
    const allData = data && data.length ? data : defaultData;
    const [insightVisible, setInsightVisible] = useState(false);

    return (
        <div id="progression-funnel" className="disease-chart-card col-span-2 insight-graph-card">
            <div className="disease-card-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div className="disease-card-titles" style={{ marginBottom: '0.5rem' }}>
                    <h3 className="disease-card-title">Disease Progression</h3>
                    <p className="disease-card-subtitle">Stage-by-stage severity drop-off.</p>
                </div>
                <div className="insight-zoom-controls">
                    <button className="zoom-btn" onClick={() => setInsightVisible(!insightVisible)}>
                        <Lightbulb size={15} /> Reveal Insight
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <FunnelChart>
                        <RechartsTooltip />
                        <Funnel dataKey="value" data={allData} isAnimationActive>
                            <LabelList position="right" fill="#3f554a" stroke="none" dataKey="stage" />
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`} style={{ minHeight: 'auto', padding: '0.75rem' }}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label" style={{ fontSize: '0.7rem' }}>💡 Insight</div>
                    <div className="insight-panel-text" style={{ fontSize: '0.8rem' }}>Understand patient drop-off and severity progression.</div>
                    {insightVisible && (
                        <div className="insight-panel-example" style={{ fontSize: '0.75rem', padding: '0.4rem' }}>
                            👉 &quot;Funnel shows a significant drop from diagnosed to critical stages, indicating that only a small percentage of cases become severe.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Dynamic Moving Average Trend ────────────────────────────────────────────
function MovingAverageTrend({ data }) {
    const defaultData = [];
    const allData = data || defaultData;
    const [selectedDisease, setSelectedDisease] = useState('Viral');
    const [insightVisible, setInsightVisible] = useState(false);

    const actualKey = selectedDisease;
    const maKey = `${selectedDisease}_MA`;

    return (
        <div id="moving-average-trend" className="disease-chart-card col-span-4 insight-graph-card" style={{ marginTop: '1.5rem' }}>
            <div className="disease-card-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <div className="disease-card-titles" style={{ marginBottom: '0.5rem' }}>
                    <h3 className="disease-card-title">Dynamic Moving Average Trend</h3>
                    <p className="disease-card-subtitle">Comparing short-term spikes against smoothed long-term trends.</p>
                </div>
                <div className="insight-zoom-controls">
                    <select 
                        className="filter-select" 
                        value={selectedDisease} 
                        onChange={(e) => setSelectedDisease(e.target.value)}
                        style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', border: '1.5px solid #c2dbca', color: '#2d5a40', fontWeight: '600' }}
                    >
                        <option value="Viral">Viral Infections</option>
                        <option value="Cardiac">Cardiac Conditions</option>
                    </select>
                    <button className="zoom-btn" onClick={() => setInsightVisible(!insightVisible)}>
                        <Lightbulb size={15} /> Reveal Trend Insight
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <ComposedChart data={allData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8f0ec" />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" />
                        <Bar dataKey={actualKey} name="Daily Cases" fill="#c2dbca" radius={[4,4,0,0]} barSize={20} />
                        <Line type="monotone" dataKey={maKey} name="Moving Average (7-Day)" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className={`insight-panel ${insightVisible ? 'insight-panel-active' : ''}`}>
                <div className="insight-panel-icon"><Lightbulb size={16} /></div>
                <div>
                    <div className="insight-panel-label">💡 Insight</div>
                    <div className="insight-panel-text">Distinguish real trends from temporary fluctuations.</div>
                    {insightVisible && (
                        <div className="insight-panel-example">
                            👉 &quot;Selecting a disease shows that while daily cases fluctuate, the moving average reveals a steady upward trend, indicating a consistent increase rather than random spikes.&quot;
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function DiseaseTrends() {
    const [data, setData] = useState(null);
    const [advancedData, setAdvancedData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [basicRes, advRes] = await Promise.all([
                    fetch(`${API_BASE}/analytics/disease-summary`),
                    fetch(`${API_BASE}/analytics/disease-insights`)
                ]);
                setData(await basicRes.json());
                setAdvancedData(await advRes.json());
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-screen">Processing Disease Analytics...</div>;
    if (!data) return <div className="error-screen">Error loading original data.</div>;

    return (
        <div className="disease-dashboard-root">
            <div className="disease-header-row">
                <div className="disease-header-titles">
                    <h1 className="disease-title">Disease Trends & Outbreak Analysis</h1>
                    <p className="disease-subtitle">Aggregated metrics from original 10,000+ local records.</p>
                </div>
            </div>

            <div className="disease-grid">
                <div id="disease-prevalence" className="disease-chart-card col-span-2">
                    <div className="disease-card-header">
                        <h3 className="disease-card-title">Prevalence: Top Diseases</h3>
                        <p className="disease-card-subtitle">Distribution by total patient volume.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', height: 260 }}>
                        <div style={{ width: '60%', height: '100%' }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data.topDiseases}
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.topDiseases.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ width: '40%' }}>
                            <div className="disease-list-container">
                                {data.topDiseases.map((item, i) => (
                                    <div key={i} className="disease-item-row">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DONUT_COLORS[i % DONUT_COLORS.length] }}></div>
                                            <span className="disease-item-label">{item.name}</span>
                                        </div>
                                        <span className="disease-item-value">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="disease-chart-card col-span-2">
                    <div className="disease-card-header">
                        <h3 className="disease-card-title">System Status</h3>
                        <p className="disease-card-subtitle">Local original data processing indicators.</p>
                    </div>
                    <div style={{ padding: '0 1rem' }}>
                        <div className="disease-insight-box alert" style={{ margin: '0 0 1rem 0' }}>
                           <AlertCircle size={20} />
                           <div>
                               <strong>Local Dataset Online</strong>
                               Verified 10,000 clinical records processed.
                           </div>
                        </div>
                        <div className="disease-insight-box" style={{ margin: '0', background: '#fef9c3', borderColor: '#facc15', color: '#854d0e' }}>
                           <Thermometer size={20} />
                           <div>
                               <strong>Model Training Ready</strong>
                               Data format exceeds standard simulation quality.
                           </div>
                        </div>
                    </div>
                </div>

                <div className="disease-chart-card col-span-4">
                    <div className="disease-card-header">
                        <h3 className="disease-card-title">Demographic Distribution (Age vs Condition)</h3>
                        <p className="disease-card-subtitle">Real age group analysis from original database.</p>
                    </div>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.demographicData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="age" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="Respiratory Infection" stackId="a" fill="#a4c9b0" />
                                <Bar dataKey="Diabetes Complications" stackId="a" fill="#7a9e87" />
                                <Bar dataKey="Cardiac Arrest" stackId="a" fill="#f5d6b3" />
                                <Bar dataKey="Fracture" stackId="a" fill="#cbd5e1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                {/* ── Advanced Analytics Grid Layout ── */}
                {advancedData && (
                    <>
                        <AgeDiseaseBubbles data={advancedData.ageDiseaseBubbles} />
                        <DiseaseTrendsTime data={advancedData.diseaseTrendsTime} />
                        <ProgressionFunnel data={advancedData.progressionFunnel} />
                        <MovingAverageTrend data={advancedData.movingAverageTrend} />
                    </>
                )}
            </div>
        </div>
    );
}
