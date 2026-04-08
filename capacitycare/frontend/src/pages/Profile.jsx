import React from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Phone, Building2, Briefcase, 
    Clock, Users, TrendingUp, Calendar, MousePointer2, 
    Zap, Timer, Star, LogIn
} from 'lucide-react';
import './Profile.css';

const Profile = () => {
    // Mock user data based on request
    const user = {
        name: "Dr. Samantha Reed",
        role: "Senior Clinical Analyst",
        department: "Emergency Medicine",
        email: "s.reed@capacitycare.org",
        contact: "+91 98765 43210",
        stats: {
            patientsWeek: 42,
            patientsMonth: 158,
            avgTreatmentTime: "14.5 min",
            deptContribution: "22.4%",
            lastLogin: "Today, 10:24 AM",
            loginFrequency: "4.8 sessions/day",
            pagesVisited: ["Dashboard", "Patient Flow", "Settings"],
            avgPatientsDay: 12,
            efficiencyScore: 94,
            responseTime: "1.2 min"
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
                        <h1>{user.name}</h1>
                        <p className="profile-subtitle">{user.role} • {user.department}</p>
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
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Phone className="info-icon" size={18} />
                            <div>
                                <label>Contact Number (Optional)</label>
                                <p>{user.contact}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Building2 className="info-icon" size={18} />
                            <div>
                                <label>Department</label>
                                <p>{user.department}</p>
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
                            <div className="stat-value">{user.stats.patientsMonth}</div>
                            <div className="stat-label">Patients (Month)</div>
                            <div className="stat-sublabel">{user.stats.patientsWeek} this week</div>
                        </div>
                        <div className="stat-card">
                            <Timer size={24} className="stat-icon" />
                            <div className="stat-value">{user.stats.avgTreatmentTime}</div>
                            <div className="stat-label">Avg Treatment Time</div>
                        </div>
                        <div className="stat-card">
                            <TrendingUp size={24} className="stat-icon" />
                            <div className="stat-value">{user.stats.deptContribution}</div>
                            <div className="stat-label">Dept Contribution</div>
                            <div className="stat-sublabel">Based on {user.stats.patientsMonth} patient files handled vs dept total.</div>
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
                                <p>{user.stats.lastLogin}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Calendar className="info-icon" size={18} />
                            <div>
                                <label>Login Frequency</label>
                                <p>{user.stats.loginFrequency}</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <Briefcase className="info-icon" size={18} />
                            <div>
                                <label>Pages Most Visited</label>
                                <div className="tag-cloud">
                                    {user.stats.pagesVisited.map(page => (
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
                            <div className="stat-value">{user.stats.efficiencyScore}/100</div>
                            <div className="stat-label">Efficiency Score</div>
                            <div className="stat-sublabel">Calculated from response time & throughput.</div>
                        </div>
                        <div className="stat-card">
                            <Users size={24} className="stat-icon" />
                            <div className="stat-value">{user.stats.avgPatientsDay}</div>
                            <div className="stat-label">Avg Patients/Day</div>
                        </div>
                        <div className="stat-card">
                            <Clock size={24} className="stat-icon" />
                            <div className="stat-value">{user.stats.responseTime}</div>
                            <div className="stat-label">Response Time</div>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default Profile;
