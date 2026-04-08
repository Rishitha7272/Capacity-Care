import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
    LayoutDashboard, Banknote, Users, Activity, 
    TrendingUp, User, Settings as SettingsIcon, 
    Search, LogOut 
} from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({ hospitalName, onLogout }) {
    const location = useLocation()
    const navigate = useNavigate()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showResults, setShowResults] = useState(false)

    const searchRegistry = [
        // Dashboard
        { label: 'Admission vs Discharge Flow', path: '/dashboard', hash: '#admission-discharge', category: 'Dashboard' },
        { label: 'Department Load Monitor', path: '/dashboard', hash: '#dept-load', category: 'Dashboard' },
        { label: 'Top Contributors (Cost/LOS)', path: '/dashboard', hash: '#top-contributors', category: 'Dashboard' },
        { label: 'Age Demographics', path: '/dashboard', hash: '#age-demographics', category: 'Dashboard' },
        { label: 'Weekly Bed Occupancy Heatmap', path: '/dashboard', hash: '#bed-heatmap', category: 'Dashboard' },
        { label: 'Cost vs Efficiency Analysis', path: '/dashboard', hash: '#cost-efficiency', category: 'Dashboard' },
        
        // Cost Analysis
        { label: 'Cost Contribution Matrix', path: '/cost-analysis', hash: '#cost-matrix', category: 'Cost Analysis' },
        { label: 'Department Expenditure Drilldown', path: '/cost-analysis', hash: '#dept-expenditure', category: 'Cost Analysis' },
        { label: 'Condition Frequency vs. Cost', path: '/cost-analysis', hash: '#freq-cost', category: 'Cost Analysis' },
        { label: 'Treatment Cost Trends', path: '/cost-analysis', hash: '#cost-trend', category: 'Cost Analysis' },
        { label: 'Seasonal Cost Spikes', path: '/cost-analysis', hash: '#seasonal-cost', category: 'Cost Analysis' },
        { label: 'Dept Inefficiency Score', path: '/cost-analysis', hash: '#efficiency-score', category: 'Cost Analysis' },
        { label: 'Procedure Anomalies (Hidden Costs)', path: '/cost-analysis', hash: '#unnecessary-cost', category: 'Cost Analysis' },
        
        // Patient Flow
        { label: 'Patient Volume vs Noise', path: '/patient-flow', hash: '#volume-noise', category: 'Patient Flow' },
        { label: 'Peak Hours Detection Heatmap', path: '/patient-flow', hash: '#peak-hours', category: 'Patient Flow' },
        { label: 'Admission vs Discharge Rates', path: '/patient-flow', hash: '#admission-discharge-flow', category: 'Patient Flow' },
        { label: 'Department Load Status', path: '/patient-flow', hash: '#dept-load-status', category: 'Patient Flow' },
        { label: 'Staff Efficiency Index', path: '/patient-flow', hash: '#staff-efficiency', category: 'Patient Flow' },
        { label: 'Flow Imbalance Tracking', path: '/patient-flow', hash: '#flow-imbalance', category: 'Patient Flow' },
        { label: 'Workload Distribution Zoom', path: '/patient-flow', hash: '#workload-dist', category: 'Patient Flow' },
        { label: 'Patient Journey Funnel', path: '/patient-flow', hash: '#journey-funnel', category: 'Patient Flow' },
        { label: 'Bottleneck Detection', path: '/patient-flow', hash: '#bottleneck-detection', category: 'Patient Flow' },
        
        // Resource Utilization
        { label: 'Bed Occupancy Gauge', path: '/resource-utilization', hash: '#occupancy-gauge', category: 'Resource Util' },
        { label: '30-Day Occupancy Trend', path: '/resource-utilization', hash: '#occupancy-trend', category: 'Resource Util' },
        { label: 'Bed Availability Breakdown', path: '/resource-utilization', hash: '#bed-availability', category: 'Resource Util' },
        { label: 'Resource Comparison (Beds/Staff)', path: '/resource-utilization', hash: '#resource-comparison', category: 'Resource Util' },
        { label: 'LOS Dept Analysis', path: '/resource-utilization', hash: '#los-dept', category: 'Resource Util' },
        { label: 'LOS Disease Analysis', path: '/resource-utilization', hash: '#los-disease', category: 'Resource Util' },
        { label: 'Peak Hour Flow Detection (Zoom)', path: '/resource-utilization', hash: '#flow-peak-zoom', category: 'Resource Util' },
        
        // Disease Trends
        { label: 'Disease Prevalence Donut', path: '/disease-trends', hash: '#disease-prevalence', category: 'Disease Trends' },
        { label: 'Clinical Alerts Panel', path: '/disease-trends', hash: '#clinical-alerts', category: 'Disease Trends' },
        { label: 'Temporal Disease Fluctuations', path: '/disease-trends', hash: '#disease-trends-temporal', category: 'Disease Trends' },
        { label: 'Seasonal Outbreak Heatmap', path: '/disease-trends', hash: '#seasonal-outbreak', category: 'Disease Trends' },
        { label: 'Age-Disease Demographic Dist', path: '/disease-trends', hash: '#age-disease-dist', category: 'Disease Trends' },
        { label: 'Readmission Rate by Condition', path: '/disease-trends', hash: '#readmission-rate', category: 'Disease Trends' },
    ];

    const filteredResults = searchQuery.trim() === '' 
        ? [] 
        : searchRegistry.filter(item => 
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSearchSelect = (item) => {
        navigate(item.path + item.hash);
        setSearchQuery('');
        setShowResults(false);
        setIsMobileOpen(false);

        // Smooth scroll to the element if already on the page
        setTimeout(() => {
            const element = document.getElementById(item.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.outline = '2px solid #a4c9b0';
                element.style.outlineOffset = '4px';
                setTimeout(() => {
                    element.style.outline = 'none';
                }, 2000);
            }
        }, 300);
    };

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Cost Analysis', path: '/cost-analysis', icon: <Banknote size={20} /> },
        { label: 'Patient Flow', path: '/patient-flow', icon: <Users size={20} /> },
        { label: 'Resource Utilization', path: '/resource-utilization', icon: <Activity size={20} /> },
        { label: 'Disease Trends', path: '/disease-trends', icon: <TrendingUp size={20} /> },
    ]

    const secondaryItems = [
        { label: 'Profile', path: '/profile', icon: <User size={20} /> },
        { label: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> },
    ]

    const handleLogout = () => {
        onLogout()
        navigate('/login')
        setIsMobileOpen(false)
    }

    const handleNavClick = () => {
        setIsMobileOpen(false)
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="sidebar-toggle"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle navigation"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside 
                className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
                onMouseLeave={() => setShowResults(false)}
            >
                {/* Logo Section */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
                            <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z" fill="#7a9e87" opacity="0.8"/>
                            <path d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="#a4c9b0" />
                        </svg>
                    </div>
                    <div className="sidebar-title">CapacityCare</div>
                </div>

                {/* Search Bar */}
                <div className="sidebar-search-container">
                    <div className="sidebar-search">
                        <span className="search-icon"><Search size={18} /></span>
                        <input 
                            type="text" 
                            placeholder="Search clinical graphs..." 
                            className="search-input" 
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => setShowResults(true)}
                        />
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {showResults && filteredResults.length > 0 && (
                        <div className="search-results-dropdown">
                            {filteredResults.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    className="search-result-item"
                                    onClick={() => handleSearchSelect(item)}
                                >
                                    <div className="result-info">
                                        <span className="result-label">{item.label}</span>
                                        <span className="result-category">{item.category}</span>
                                    </div>
                                    <span className="result-arrow">→</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {showResults && searchQuery && filteredResults.length === 0 && (
                        <div className="search-results-dropdown no-results">
                            No matching graphs found.
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`nav-link ${
                                        location.pathname === item.path ? 'active' : ''
                                    }`}
                                    onClick={handleNavClick}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="nav-divider"></div>
                    
                    <ul className="nav-list">
                        {secondaryItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className="nav-link secondary"
                                    onClick={handleNavClick}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    <span className="nav-label">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User Profile Footer */}
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            <svg width="32" height="32" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#a4c9b0" /><text x="50%" y="55%" textAnchor="middle" fontSize="16" fill="#fff" fontWeight="bold" dy=".3em">H</text></svg>
                        </div>
                        <div className="user-info">
                            <div className="user-name">{hospitalName || 'Health Center'}</div>
                            <div className="user-role">Administrator</div>
                        </div>
                        <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
