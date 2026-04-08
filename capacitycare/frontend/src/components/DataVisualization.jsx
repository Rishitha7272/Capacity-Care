import { useEffect, useRef, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import './DataVisualization.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const ADMISSIONS = [142, 189, 210, 178, 230, 195, 160]
const DISCHARGES = [120, 175, 198, 165, 215, 180, 148]
const ICU_DEPTS = ['ICU A', 'ICU B', 'ICU C', 'ICU D', 'ICU E']
const ICU_VALS = [87, 72, 95, 63, 78]
const HEATMAP_HOURS = ['6am', '9am', '12pm', '3pm', '6pm', '9pm']
const HEATMAP_DEPTS = ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics']
const HEATMAP_VALS = [
    [45, 78, 92, 85, 70, 55],
    [60, 88, 95, 90, 83, 68],
    [30, 65, 88, 82, 76, 40],
    [55, 72, 80, 75, 68, 50],
    [40, 60, 75, 70, 62, 45],
    [35, 58, 72, 68, 58, 42],
]

const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: { display: true, position: 'top', labels: { color: '#5a6b62', font: { family: 'Inter', size: 12 }, boxWidth: 12, padding: 16 } },
        tooltip: {
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: 'rgba(122,158,135,0.3)',
            borderWidth: 1,
            titleColor: '#2c3e35',
            bodyColor: '#5a6b62',
            padding: 12,
            cornerRadius: 12,
        },
    },
    scales: {
        x: { grid: { color: 'rgba(122,158,135,0.08)' }, ticks: { color: '#8a9e94', font: { family: 'Inter', size: 11 } } },
        y: { grid: { color: 'rgba(122,158,135,0.08)' }, ticks: { color: '#8a9e94', font: { family: 'Inter', size: 11 } } },
    },
}

const barOptions = {
    ...lineOptions,
    plugins: { ...lineOptions.plugins, legend: { display: false } },
    scales: {
        x: { grid: { display: false }, ticks: { color: '#8a9e94', font: { family: 'Inter', size: 11 } } },
        y: { grid: { color: 'rgba(122,158,135,0.08)' }, ticks: { color: '#8a9e94', font: { family: 'Inter', size: 11 }, callback: v => v + '%' }, max: 100 },
    },
}

function PatientFlowChart() {
    const data = {
        labels: DAYS,
        datasets: [
            {
                label: 'Admissions',
                data: ADMISSIONS,
                borderColor: '#7a9e87',
                backgroundColor: 'rgba(122,158,135,0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#7a9e87',
                borderWidth: 2.5,
            },
            {
                label: 'Discharges',
                data: DISCHARGES,
                borderColor: '#5b8c8a',
                backgroundColor: 'rgba(91,140,138,0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#5b8c8a',
                borderWidth: 2.5,
            },
        ],
    }
    return <Line data={data} options={lineOptions} />
}

function IcuOccupancyChart() {
    const getColor = (v) => {
        if (v >= 90) return '#c4896a'
        if (v >= 75) return '#7a9e87'
        return '#5b8c8a'
    }
    const data = {
        labels: ICU_DEPTS,
        datasets: [{
            data: ICU_VALS,
            backgroundColor: ICU_VALS.map(v => `${getColor(v)}33`),
            borderColor: ICU_VALS.map(getColor),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }],
    }
    return <Bar data={data} options={barOptions} />
}

function HeatmapCell({ value }) {
    const alpha = value / 100
    const color = value >= 85
        ? `rgba(196,137,106,${0.3 + alpha * 0.5})`
        : value >= 65
            ? `rgba(122,158,135,${0.2 + alpha * 0.5})`
            : `rgba(91,140,138,${0.1 + alpha * 0.4})`
    return (
        <div
            className="heatmap-cell"
            style={{ background: color }}
            title={`${value}%`}
        >
            <span>{value}%</span>
        </div>
    )
}

function Heatmap() {
    return (
        <div className="heatmap-wrapper">
            <div className="heatmap-grid" style={{ gridTemplateColumns: `80px repeat(${HEATMAP_HOURS.length}, 1fr)` }}>
                <div className="heatmap-corner" />
                {HEATMAP_HOURS.map(h => <div key={h} className="heatmap-col-label">{h}</div>)}
                {HEATMAP_DEPTS.map((dept, di) => (
                    <>
                        <div key={dept} className="heatmap-row-label">{dept}</div>
                        {HEATMAP_VALS[di].map((val, ci) => <HeatmapCell key={ci} value={val} />)}
                    </>
                ))}
            </div>
            <div className="heatmap-legend">
                <span className="legend-label">Low</span>
                <div className="legend-bar" />
                <span className="legend-label">High</span>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, children }) {
    return (
        <button className={`viz-tab ${active ? 'active' : ''}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default function DataVisualization() {
    const [activeTab, setActiveTab] = useState('flow')
    const sectionRef = useRef(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section className="section viz-section" id="visualization" ref={sectionRef}>
            <div className="container">
                <div className={`section-header fade-up ${visible ? 'visible' : ''}`}>
                    <span className="badge badge-teal section-label">Data Visualization</span>
                    <h2 className="display-2 section-title">
                        Interactive dashboards that speak for themselves
                    </h2>
                    <p className="body-lg section-subtitle">
                        Explore your hospital's performance through beautiful, real-time charts and heatmaps designed for clinical decision-making.
                    </p>
                </div>

                <div className={`viz-container card fade-up fade-up-delay-2 ${visible ? 'visible' : ''}`}>
                    <div className="viz-header">
                        <div className="viz-tabs">
                            <TabButton active={activeTab === 'flow'} onClick={() => setActiveTab('flow')}>Patient Flow</TabButton>
                            <TabButton active={activeTab === 'icu'} onClick={() => setActiveTab('icu')}>ICU Occupancy</TabButton>
                            <TabButton active={activeTab === 'heatmap'} onClick={() => setActiveTab('heatmap')}>Department Heatmap</TabButton>
                        </div>
                        <div className="viz-meta">
                            <span className="live-dot" />
                            <span className="body-sm" style={{ color: 'var(--text-muted)' }}>Live • Updated 2min ago</span>
                        </div>
                    </div>

                    <div className="viz-chart-area">
                        {activeTab === 'flow' && (
                            <div className="chart-wrap">
                                <PatientFlowChart />
                            </div>
                        )}
                        {activeTab === 'icu' && (
                            <div className="chart-wrap">
                                <IcuOccupancyChart />
                            </div>
                        )}
                        {activeTab === 'heatmap' && (
                            <div className="heatmap-area">
                                <Heatmap />
                            </div>
                        )}
                    </div>

                    {/* Bottom KPI strip */}
                    <div className="viz-kpis">
                        {[
                            { label: 'Total Patients', value: '4,218', color: 'sage' },
                            { label: 'Avg Wait Time', value: '14.2m', color: 'teal' },
                            { label: 'Beds Available', value: '132', color: 'clay' },
                            { label: 'Staff On Duty', value: '487', color: 'sage' },
                        ].map((k, i) => (
                            <div key={i} className={`viz-kpi viz-kpi-${k.color}`}>
                                <span className="kpi-value">{k.value}</span>
                                <span className="kpi-label">{k.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
