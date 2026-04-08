import React, { useState, useEffect } from 'react';
import { 
    Settings as SettingsIcon, Shield, Database, 
    PieChart, Sliders, Save, RefreshCw, 
    Wifi, Key, FileText, LogOut
} from 'lucide-react';
import './Settings.css';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSaving, setIsSaving] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Simulated Settings State
    const [config, setConfig] = useState({
        defaultLanding: 'Dashboard',
        theme: 'Light',
        noiseThreshold: 75,
        occupancyThreshold: 90,
        patientLoadThreshold: 80,
        refreshInterval: '10s',
        emailAlerts: true,
        inAppAlerts: true,
        smsAlerts: false,
        autoSaveFilters: true,
        capacityER: 100,
        capacityICU: 50,
        efficiencyFormula: 'Cost / (Patients * LOS)'
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert('System configuration updated successfully!');
        }, 1200);
    };

    const startScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            alert('Found 4 IoT Noise Sensors in Emergency and ICU wards.');
        }, 3000);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="settings-section">
                        <h2 className="section-title"><PieChart size={24} /> Dashboard Preferences</h2>
                        <div className="section-group">
                            <h3 className="group-title">Interface Settings</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Default Landing Page</span>
                                    <span className="setting-sublabel">The page displayed immediately after login.</span>
                                </div>
                                <select 
                                    className="settings-select"
                                    value={config.defaultLanding}
                                    onChange={(e) => setConfig({...config, defaultLanding: e.target.value})}
                                >
                                    <option>Dashboard</option>
                                    <option>Cost Analysis</option>
                                    <option>Patient Flow</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">System Theme</span>
                                    <span className="setting-sublabel">Toggle between light and dark clinical themes.</span>
                                </div>
                                <div className="theme-toggle-group">
                                    <button 
                                        className={`btn-secondary ${config.theme === 'Light' ? 'active-theme' : ''}`}
                                        style={{ background: config.theme === 'Light' ? '#a4c9b0' : '', color: config.theme === 'Light' ? '#fff' : '' }}
                                        onClick={() => setConfig({...config, theme: 'Light'})}
                                    >Light</button>
                                    <button 
                                        className={`btn-secondary ${config.theme === 'Dark' ? 'active-theme' : ''}`}
                                        style={{ background: config.theme === 'Dark' ? '#5b8c8a' : '', color: config.theme === 'Dark' ? '#fff' : '' }}
                                        onClick={() => setConfig({...config, theme: 'Dark'})}
                                    >Dark</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'alerts':
                return (
                    <div className="settings-section">
                        <h2 className="section-title"><Sliders size={24} /> Alert Thresholds (System Controls)</h2>
                        <div className="section-group">
                            <h3 className="group-title">Trigger Conditions</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Noise Level Alert Threshold</span>
                                    <span className="setting-sublabel">Alert when ambient noise exceeds this decibel level.</span>
                                </div>
                                <div className="range-container">
                                    <input 
                                        type="range" min="40" max="100" className="range-input" 
                                        value={config.noiseThreshold} 
                                        onChange={(e) => setConfig({...config, noiseThreshold: e.target.value})} 
                                    />
                                    <span className="range-value">{config.noiseThreshold} dB</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Critical Bed Occupancy</span>
                                    <span className="setting-sublabel">Mark department as "Critical" when occupancy reaches:</span>
                                </div>
                                <div className="range-container">
                                    <input 
                                        type="range" min="50" max="100" className="range-input" 
                                        value={config.occupancyThreshold} 
                                        onChange={(e) => setConfig({...config, occupancyThreshold: e.target.value})} 
                                    />
                                    <span className="range-value">{config.occupancyThreshold}%</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Patient Load Overload Index</span>
                                    <span className="setting-sublabel">Threshold for triggering workload redistribution alerts.</span>
                                </div>
                                <div className="range-container">
                                    <input 
                                        type="range" min="30" max="100" className="range-input" 
                                        value={config.patientLoadThreshold} 
                                        onChange={(e) => setConfig({...config, patientLoadThreshold: e.target.value})} 
                                    />
                                    <span className="range-value">{config.patientLoadThreshold}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'refresh':
                return (
                    <div className="settings-section">
                        <h2 className="section-title"><RefreshCw size={24} /> Data Refresh & Filters</h2>
                        <div className="section-group">
                            <h3 className="group-title">Autosave & Polling</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Auto-Refresh Interval</span>
                                    <span className="setting-sublabel">Frequency of IoT telemetry updates (Noise/Occupancy).</span>
                                </div>
                                <select 
                                    className="settings-select"
                                    value={config.refreshInterval}
                                    onChange={(e) => setConfig({...config, refreshInterval: e.target.value})}
                                >
                                    <option>5 sec</option>
                                    <option>10 sec</option>
                                    <option>30 sec</option>
                                    <option>Manual Only</option>
                                </select>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Save Default Filters</span>
                                    <span className="setting-sublabel">Retain Department/Disease filters across sessions.</span>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" checked={config.autoSaveFilters} 
                                        onChange={(e) => setConfig({...config, autoSaveFilters: e.target.checked})}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="settings-section">
                        <h2 className="section-title"><Shield size={24} /> Privacy & Security</h2>
                        <div className="section-group">
                            <h3 className="group-title">Access Control</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Change Administrator Password</span>
                                    <span className="setting-sublabel">Secure your control center credentials.</span>
                                </div>
                                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Key size={16} /> Reset Password
                                </button>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">System Access Logs</span>
                                    <span className="setting-sublabel">Audit trail of configuration changes.</span>
                                </div>
                                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FileText size={16} /> View Logs
                                </button>
                            </div>
                            <div className="setting-item" style={{ border: 'none', marginTop: '1rem' }}>
                                <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <LogOut size={16} /> Forced Session Logout
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'config':
                return (
                    <div className="settings-section">
                        <h2 className="section-title"><Database size={24} /> System Configuration</h2>
                        <div className="section-group">
                            <h3 className="group-title">Hospital Parameters</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Emergency Ward Capacity</span>
                                    <span className="setting-sublabel">Total certified beds for ER department.</span>
                                </div>
                                <input 
                                    type="number" className="settings-input" 
                                    value={config.capacityER} 
                                    onChange={(e) => setConfig({...config, capacityER: e.target.value})} 
                                />
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">ICU Ward Capacity</span>
                                    <span className="setting-sublabel">Total certified beds for Intensive Care.</span>
                                </div>
                                <input 
                                    type="number" className="settings-input" 
                                    value={config.capacityICU} 
                                    onChange={(e) => setConfig({...config, capacityICU: e.target.value})} 
                                />
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Efficiency Computation Logic</span>
                                    <span className="setting-sublabel">Formula used for 'Resource ROI' metrics.</span>
                                </div>
                                <input 
                                    type="text" className="settings-input" 
                                    style={{ width: '250px' }}
                                    value={config.efficiencyFormula} 
                                    onChange={(e) => setConfig({...config, efficiencyFormula: e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-root">
            <header className="settings-header">
                <h1 className="settings-title">System Control Center</h1>
                <p className="settings-subtitle">Manage clinical thresholds, telemetry inputs, and platform behavior.</p>
            </header>

            <div className="settings-container">
                {/* Sidebar Tabs */}
                <aside className="settings-tabs">
                    <button className={`settings-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <PieChart size={18} /> <span>Dashboard</span>
                    </button>
                    <button className={`settings-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')}>
                        <Sliders size={18} /> <span>Alert Thresholds</span>
                    </button>
                    <button className={`settings-tab-btn ${activeTab === 'refresh' ? 'active' : ''}`} onClick={() => setActiveTab('refresh')}>
                        <RefreshCw size={18} /> <span>Data & Refresh</span>
                    </button>
                    <button className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                        <Shield size={18} /> <span>Privacy & Security</span>
                    </button>
                    <button className={`settings-tab-btn ${activeTab === 'config' ? 'active' : ''}`} onClick={() => setActiveTab('config')}>
                        <Database size={18} /> <span>System Config</span>
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="settings-content">
                    {renderTabContent()}

                    <div className="settings-save-row">
                        <button className="btn-secondary" onClick={() => window.location.reload()}>Discard Changes</button>
                        <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                            <Save size={18} />
                            {isSaving ? 'Applying Config...' : 'Save Configuration'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
