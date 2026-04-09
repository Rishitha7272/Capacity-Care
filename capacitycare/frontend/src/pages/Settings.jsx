import React, { useState, useEffect } from 'react';
import { 
    Settings as SettingsIcon, Shield, Database, 
    PieChart, Sliders, Save, RefreshCw, 
    Wifi, Key, FileText, LogOut, XCircle, CheckCircle2
} from 'lucide-react';
import './Settings.css';

const INITIAL_CONFIG = {
    defaultLanding: 'Dashboard',
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
};

export default function Settings({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSaving, setIsSaving] = useState(false);
    const [logs, setLogs] = useState([]);
    const [passForm, setPassForm] = useState({ current: '', new: '', confirm: '' });
    const [passStatus, setPassStatus] = useState({ type: '', message: '' });
    
    // Persistent Saved State
    const [savedConfig, setSavedConfig] = useState(() => {
        const local = localStorage.getItem('capacitycare_config');
        return local ? JSON.parse(local) : INITIAL_CONFIG;
    });

    // Working Draft State
    const [draftConfig, setDraftConfig] = useState(savedConfig);

    // Track if there are unsaved changes
    const hasChanges = JSON.stringify(savedConfig) !== JSON.stringify(draftConfig);

    // Fetch logs when security tab is active
    useEffect(() => {
        if (activeTab === 'security') {
            fetchLogs();
        }
    }, [activeTab]);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/audit/logs');
            const data = await response.json();
            setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        
        try {
            // Save settings
            setSavedConfig(draftConfig);
            localStorage.setItem('capacitycare_config', JSON.stringify(draftConfig));

            // Log the event
            await fetch('http://localhost:5001/api/audit/log-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user?.email || 'System',
                    event: 'Configuration Update',
                    status: 'success',
                    details: 'System-wide thresholds and capacities updated.'
                })
            });

            setTimeout(() => setIsSaving(false), 800);
        } catch (err) {
            console.error('Save failed', err);
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passForm.new !== passForm.confirm) {
            setPassStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        try {
            const token = localStorage.getItem('capacitycare_token');
            const response = await fetch('http://localhost:5001/api/auth/change-password', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passForm.current,
                    newPassword: passForm.new
                })
            });

            const data = await response.json();
            if (response.ok) {
                setPassStatus({ type: 'success', message: 'Security Key updated successfully' });
                setPassForm({ current: '', new: '', confirm: '' });
            } else {
                setPassStatus({ type: 'error', message: data.error || 'Failed to update key' });
            }
        } catch (err) {
            setPassStatus({ type: 'error', message: 'Network error occurred' });
        }
    };

    const handleDiscard = () => {
        setDraftConfig(savedConfig);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="settings-section animate-fade-in">
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
                                    value={draftConfig.defaultLanding}
                                    onChange={(e) => setDraftConfig({...draftConfig, defaultLanding: e.target.value})}
                                >
                                    <option>Dashboard</option>
                                    <option>Cost Analysis</option>
                                    <option>Patient Flow</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'alerts':
                return (
                    <div className="settings-section animate-fade-in">
                        <h2 className="section-title"><Sliders size={24} /> Alert Thresholds</h2>
                        <div className="section-group">
                            <h3 className="group-title">Critical Trigger Conditions</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Noise Level Alert Threshold</span>
                                    <span className="setting-sublabel">Threshold for high-stress environmental alerts.</span>
                                </div>
                                <div className="range-container">
                                    <input 
                                        type="range" min="40" max="100" className="range-input" 
                                        value={draftConfig.noiseThreshold} 
                                        onChange={(e) => setDraftConfig({...draftConfig, noiseThreshold: parseInt(e.target.value)})} 
                                    />
                                    <span className="range-value">{draftConfig.noiseThreshold} dB</span>
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
                                        value={draftConfig.occupancyThreshold} 
                                        onChange={(e) => setDraftConfig({...draftConfig, occupancyThreshold: parseInt(e.target.value)})} 
                                    />
                                    <span className="range-value">{draftConfig.occupancyThreshold}%</span>
                                </div>
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Patient Load Overload Index</span>
                                    <span className="setting-sublabel">Threshold for workload redistribution alerts.</span>
                                </div>
                                <div className="range-container">
                                    <input 
                                        type="range" min="30" max="100" className="range-input" 
                                        value={draftConfig.patientLoadThreshold} 
                                        onChange={(e) => setDraftConfig({...draftConfig, patientLoadThreshold: parseInt(e.target.value)})} 
                                    />
                                    <span className="range-value">{draftConfig.patientLoadThreshold}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'refresh':
                return (
                    <div className="settings-section animate-fade-in">
                        <h2 className="section-title"><RefreshCw size={24} /> Data & Refresh</h2>
                        <div className="section-group">
                            <h3 className="group-title">Telemetry Polling</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Auto-Refresh Interval</span>
                                    <span className="setting-sublabel">Frequency of IoT data stream updates.</span>
                                </div>
                                <select 
                                    className="settings-select"
                                    value={draftConfig.refreshInterval}
                                    onChange={(e) => setDraftConfig({...draftConfig, refreshInterval: e.target.value})}
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
                                    <span className="setting-sublabel">Retain clinical filters across app sessions.</span>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" checked={draftConfig.autoSaveFilters} 
                                        onChange={(e) => setDraftConfig({...draftConfig, autoSaveFilters: e.target.checked})}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-section animate-fade-in">
                        <h2 className="section-title"><Shield size={24} /> Privacy & Credentials</h2>
                        
                        <div className="section-group">
                            <h3 className="group-title">Administrative Security Key</h3>
                            <form className="password-change-form" onSubmit={handlePasswordChange}>
                                <div className="form-grid">
                                    <div className="input-field">
                                        <label>Current Security Key</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={passForm.current}
                                            onChange={(e) => setPassForm({...passForm, current: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>New Security Key</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={passForm.new}
                                            onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Confirm New Key</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={passForm.confirm}
                                            onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                {passStatus.message && (
                                    <div className={`status-message ${passStatus.type}`}>
                                        {passStatus.type === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                                        <span>{passStatus.message}</span>
                                    </div>
                                )}

                                <button type="submit" className="btn-secondary update-key-btn">
                                    <Key size={16} /> Update Security Protocol
                                </button>
                            </form>
                        </div>

                        <div className="section-group">
                            <div className="group-header-flex">
                                <h3 className="group-title">Institutional Audit Logs</h3>
                                <button className="btn-icon" onClick={fetchLogs}><RefreshCw size={14} /></button>
                            </div>
                            <div className="audit-log-container">
                                {logs.length === 0 ? (
                                    <div className="empty-logs">No recent institutional activities recorded.</div>
                                ) : (
                                    <table className="audit-table">
                                        <thead>
                                            <tr>
                                                <th>Timestamp</th>
                                                <th>Clinician</th>
                                                <th>Event</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map(log => (
                                                <tr key={log.id}>
                                                    <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
                                                    <td>{log.email}</td>
                                                    <td>{log.event}</td>
                                                    <td>
                                                        <span className={`status-pill ${log.status}`}>
                                                            {log.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className="section-group critical-zone">
                            <h3 className="group-title">Emergency Access Controls</h3>
                            <div className="setting-item" style={{ border: 'none' }}>
                                <div className="setting-label">
                                    <span className="setting-label-text">Global Session Termination</span>
                                    <span className="setting-sublabel">Immediately invalidate all active tokens and force system logout.</span>
                                </div>
                                <button className="btn-secondary logout-danger-btn" onClick={onLogout}>
                                    <LogOut size={16} /> Forced Session Logout
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'config':
                return (
                    <div className="settings-section animate-fade-in">
                        <h2 className="section-title"><Database size={24} /> System Config</h2>
                        <div className="section-group">
                            <h3 className="group-title">Institutional Capacity Parameters</h3>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Emergency Ward Capacity</span>
                                    <span className="setting-sublabel">Total certified beds for ER department.</span>
                                </div>
                                <input 
                                    type="number" className="settings-input" 
                                    value={draftConfig.capacityER} 
                                    onChange={(e) => setDraftConfig({...draftConfig, capacityER: parseInt(e.target.value) || 0})} 
                                />
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">ICU Ward Capacity</span>
                                    <span className="setting-sublabel">Total certified beds for Intensive Care.</span>
                                </div>
                                <input 
                                    type="number" className="settings-input" 
                                    value={draftConfig.capacityICU} 
                                    onChange={(e) => setDraftConfig({...draftConfig, capacityICU: parseInt(e.target.value) || 0})} 
                                />
                            </div>
                            <div className="setting-item">
                                <div className="setting-label">
                                    <span className="setting-label-text">Efficiency Computation Logic</span>
                                    <span className="setting-sublabel">Formula used for system-wide ROI metrics.</span>
                                </div>
                                <input 
                                    type="text" className="settings-input" 
                                    style={{ width: '250px' }}
                                    value={draftConfig.efficiencyFormula} 
                                    onChange={(e) => setDraftConfig({...draftConfig, efficiencyFormula: e.target.value})} 
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
        <div className="settings-root animate-fade-in">
            <header className="settings-header">
                <div className="header-flex">
                    <div>
                        <h1 className="settings-title">System Control Center</h1>
                        <p className="settings-subtitle">Manage institutional thresholds and platform infrastructure.</p>
                    </div>
                    {hasChanges && (
                        <div className="unsaved-badge animate-fade-in">
                            <RefreshCw size={14} className="spinning" />
                            <span>Unsaved Changes Detected</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="settings-container">
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

                <main className="settings-content">
                    {renderTabContent()}

                    <div className="settings-save-row">
                        <button 
                            className="btn-secondary discard-btn" 
                            onClick={handleDiscard}
                            disabled={!hasChanges || isSaving}
                        >
                            <XCircle size={18} />
                            Discard Changes
                        </button>
                        <button 
                            className="btn-primary" 
                            onClick={handleSave} 
                            disabled={!hasChanges || isSaving}
                        >
                            <Save size={18} />
                            {isSaving ? 'Committing Changes...' : 'Save Configuration'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
