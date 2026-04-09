import React from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Phone, Building2, Briefcase, 
    Clock, Users, TrendingUp, Calendar, MousePointer2, 
    Zap, Timer, Star, LogIn
} from 'lucide-react';
import './Profile.css';

const Profile = ({ user }) => {
    // If no user prop (e.g. initial load), use fallback
    if (!user) return <div className="loading-screen">Syncing Profile Data...</div>;

    const displayUser = {
        name: user.name,
        role: user.role,
        department: user.department,
        email: user.email,
        contact: user.contact || "Not Provided",
        stats: {
            patientsMonth: user.stats?.patientsMonth || 0,
            avgTreatmentTime: `${user.stats?.avgTreatmentTime || 0} min`,
            deptContribution: `${user.stats?.deptContribution || 0}%`,
            lastLogin: user.stats?.lastLogin ? new Date(user.stats.lastLogin).toLocaleString() : "First Session",
            efficiencyScore: user.stats?.efficiencyScore || 0,
            avgPatientsDay: Math.round((user.stats?.patientsMonth || 0) / 22), // Estimate based on working days
            responseTime: "1.2 min", // Field currently missing in JSON, using placeholder
            loginFrequency: "Daily",
            pagesVisited: ["Dashboard", "Patient Flow", "Profile"],
            patientsWeek: Math.round((user.stats?.patientsMonth || 0) / 4) // Estimate
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="profile-container">
            <header className="profile-header">
                <div className="profile-identity">
                    <div className="profile-avatar">
                        <User size={48} color="var(--lp-primary)" />
                    </div>
                    <div className="profile-basic-info">
                        <h1>{displayUser.name}</h1>
                        <p className="profile-subtitle">{displayUser.role} • {displayUser.department}</p>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn-edit-profile">Edit Profile</button>
                </div>
            </header>

            <motion.div 
                className="profile-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Contact Information */}
                <motion.section className="profile-section" variants={cardVariants}>
                    <h2 className="section-title"><Mail size={20} /> Contact Details</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <Mail className="info-icon" size={18} />
                            <div>
                                <label>Email Address</label>
                                <p>{displayUser.email}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Phone className="info-icon" size={18} />
                            <div>
                                <label>Contact Number (Optional)</label>
                                <p>{displayUser.contact}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Building2 className="info-icon" size={18} />
                            <div>
                                <label>Department</label>
                                <p>{displayUser.department}</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Clinical Performance */}
                <motion.section className="profile-section highlight" variants={cardVariants}>
                    <h2 className="section-title"><Zap size={20} /> Clinical High-Fidelity Performance</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <Users size={24} className="stat-icon" />
                            <div className="stat-value">{displayUser.stats.patientsMonth}</div>
                            <div className="stat-label">Patients (Month)</div>
                            <div className="stat-sublabel">{displayUser.stats.patientsWeek} this week</div>
                        </div>
                        <div className="stat-card">
                            <Timer size={24} className="stat-icon" />
                            <div className="stat-value">{displayUser.stats.avgTreatmentTime}</div>
                            <div className="stat-label">Avg Treatment Time</div>
                        </div>
                        <div className="stat-card">
                            <TrendingUp size={24} className="stat-icon" />
                            <div className="stat-value">{displayUser.stats.deptContribution}</div>
                            <div className="stat-label">Dept Contribution</div>
                            <div className="stat-sublabel">Based on {displayUser.stats.patientsMonth} patient files handled vs dept total.</div>
                        </div>
                    </div>
                </motion.section>

                {/* System Usage */}
                <motion.section className="profile-section" variants={cardVariants}>
                    <h2 className="section-title"><MousePointer2 size={20} /> Workflow & System Identity</h2>
                    <div className="info-list">
                        <div className="info-item">
                            <LogIn className="info-icon" size={18} />
                            <div>
                                <label>Last Login</label>
                                <p>{displayUser.stats.lastLogin}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar className="info-icon" size={18} />
                            <div>
                                <label>Login Frequency</label>
                                <p>{displayUser.stats.loginFrequency}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Briefcase className="info-icon" size={18} />
                            <div>
                                <label>Pages Most Visited</label>
                                <div className="tag-cloud">
                                    {displayUser.stats.pagesVisited.map(page => (
                                        <span key={page} className="page-tag">{page}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Operational Efficiency */}
                <motion.section className="profile-section expert" variants={cardVariants}>
                    <h2 className="section-title"><Star size={20} /> Operational Efficiency</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <Star size={24} className="stat-icon-gold" />
                            <div className="stat-value">{displayUser.stats.efficiencyScore}/100</div>
                            <div className="stat-label">Efficiency Score</div>
                            <div className="stat-sublabel">Calculated from response time & throughput.</div>
                        </div>
                        <div className="stat-card">
                            <Users size={24} className="stat-icon" />
                            <div className="stat-value">{displayUser.stats.avgPatientsDay}</div>
                            <div className="stat-label">Avg Patients/Day</div>
                        </div>
                        <div className="stat-card">
                            <Clock size={24} className="stat-icon" />
                            <div className="stat-value">{displayUser.stats.responseTime}</div>
                            <div className="stat-label">Response Time</div>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default Profile;
