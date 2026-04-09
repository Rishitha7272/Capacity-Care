const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// ─── Database Connection & Startup ───────────────────────────────────────────
const startServer = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB (CapacityCare Credentials DB)');

        app.listen(PORT, () => {
            console.log(`🏥 CapacityCare API active on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Critical Startup Error:', err.message);
        if (err.message.includes('auth')) {
            console.error('👉 TIP: Check your MongoDB password and ensure special characters like @ are URL-encoded.');
        }
        process.exit(1);
    }
};

startServer();

// Helper to read JSON files
const readData = (filename) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper to write JSON files
const writeData = (filename, data) => {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_, res) => {
    res.json({ 
        status: 'healthy', 
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date() 
    });
});

// ─── Authentication Routes ───────────────────────────────────────────────────

// Register a new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, hospitalName, role } = req.body;
        console.log(`📝 Registration attempt: ${email} | Role: ${role || 'admin'}`);
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn(`⚠️ Registration failed: User ${email} exists`);
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            email, 
            password: hashedPassword, 
            hospitalName: hospitalName || 'City General Hospital',
            role: role || 'admin'
        });
        await newUser.save();

        console.log(`✅ User registered: ${email}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(`❌ Registration Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`🔑 Login attempt: [${email}]`);
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.warn(`⚠️ Login failed: User ${email} not found`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`⚠️ Login failed: Password mismatch for ${email}`);
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        console.log(`✅ Login successful: ${email} (${user.role})`);
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                hospitalName: user.hospitalName,
                stats: user.stats
            }
        });
    } catch (err) {
        console.error(`❌ Login Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Verify Token
app.get('/api/auth/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            valid: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                hospitalName: user.hospitalName,
                stats: user.stats
            }
        });
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// ─── Analytics Summary ───────────────────────────────────────────────────────
app.get('/api/analytics/stats', (req, res) => {
    const stats = readData('analytics_summary.json');
    if (!stats) return res.status(404).json({ error: 'Stats not found' });
    res.json(stats);
});

// ─── Massive Patient Records ─────────────────────────────────────────────────
app.get('/api/analytics/patients', (req, res) => {
    const patients = readData('patient_records.json');
    const { limit = 100, offset = 0, dept } = req.query;
    
    let filtered = patients || [];
    if (dept) {
        filtered = filtered.filter(p => p.department.toLowerCase() === dept.toLowerCase());
    }
    
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit));
    res.json({
        total: filtered.length,
        limit: Number(limit),
        offset: Number(offset),
        data: paginated
    });
});

// ─── Department Stats ────────────────────────────────────────────────────────
app.get('/api/analytics/departments', (req, res) => {
    const stats = readData('department_stats.json');
    res.json(stats || []);
});

// ─── Cost Summary ────────────────────────────────────────────────────────────
app.get('/api/analytics/cost-summary', (req, res) => {
    const patients = readData('patient_records.json') || [];
    
    // 1. Group by Dept/Diagnosis for Treemap
    const depts = {};
    patients.forEach(p => {
        if (!depts[p.department]) depts[p.department] = {};
        if (!depts[p.department][p.diagnosis]) depts[p.department][p.diagnosis] = 0;
        depts[p.department][p.diagnosis] += p.cost;
    });

    const treemapData = Object.keys(depts).map(deptName => ({
        name: deptName,
        children: Object.keys(depts[deptName]).map(diagName => ({
            name: diagName,
            size: depts[deptName][diagName]
        }))
    }));

    // 2. Trend Data (Last 6 Months)
    const trendMap = {};
    patients.forEach(p => {
        const month = p.admissionDate.substring(0, 7); // YYYY-MM
        if (!trendMap[month]) trendMap[month] = { cost: 0, count: 0 };
        trendMap[month].cost += p.cost;
        trendMap[month].count += 1;
    });

    const trendData = Object.keys(trendMap).sort().map(month => ({
        month,
        avgCost: Math.round(trendMap[month].cost / trendMap[month].count),
        patientVolume: trendMap[month].count
    }));

    res.json({ treemapData, trendData });
});

// ─── Disease Summary ─────────────────────────────────────────────────────────
app.get('/api/analytics/disease-summary', (req, res) => {
    const patients = readData('patient_records.json') || [];
    
    // 1. Prevalence (Total counts)
    const counts = {};
    patients.forEach(p => {
        counts[p.diagnosis] = (counts[p.diagnosis] || 0) + 1;
    });
    
    const topDiseases = Object.keys(counts).map(name => ({
        name,
        value: counts[name],
        growth: '+5%' // Mock growth for UI feel
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    // 2. Demographic (Age vs Disease)
    const ageGroups = ['0-18', '19-40', '41-60', '60+'];
    const demographicData = ageGroups.map(group => {
        const [min, max] = group.includes('+') ? [60, 120] : group.split('-').map(Number);
        const entry = { age: group };
        const groupPatients = patients.filter(p => p.age >= min && p.age <= max);
        
        ['Respiratory Infection', 'Diabetes Complications', 'Cardiac Arrest', 'Fracture'].forEach(diag => {
            entry[diag] = groupPatients.filter(p => p.diagnosis === diag).length;
        });
        return entry;
    });

    res.json({ topDiseases, demographicData });
});

// ─── Patient Flow (Time Series) ──────────────────────────────────────────────
app.get('/api/analytics/patient-flow', (req, res) => {
    const patients = readData('patient_records.json') || [];
    const { range = '7d' } = req.query;
    
    let labels = [];
    let groupFn = (dateStr) => dateStr.split('T')[0]; // Default: YYYY-MM-DD
    
    if (range === '7d' || range === '1m') {
        const days = range === '7d' ? 7 : 30;
        labels = [...Array(days)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
    } else if (range === '6m' || range === '1y') {
        const months = range === '6m' ? 6 : 12;
        groupFn = (dateStr) => dateStr.substring(0, 7); // YYYY-MM
        labels = [...Array(months)].map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            return d.toISOString().substring(0, 7);
        }).reverse();
    }

    const flowData = {
        labels,
        datasets: [
            { 
                label: 'Admissions', 
                data: labels.map(label => patients.filter(p => p.admissionDate && groupFn(p.admissionDate) === label).length) 
            },
            { 
                label: 'Discharges', 
                data: labels.map(label => patients.filter(p => p.dischargeDate && groupFn(p.dischargeDate) === label).length) 
            },
        ],
    };
    res.json(flowData);
});

// ─── Advanced Patient Flow (Heatmap & Sankey) ────────────────────────────────
app.get('/api/analytics/patient-flow-advanced', (req, res) => {
    const data = readData('patient_flow_advanced.json');
    if (!data) return res.status(404).json({ error: 'Data not found' });
    res.json(data);
});

// ─── Cost Insights (Scatter + Line Chart Data) ───────────────────────────────
app.get('/api/analytics/cost-insights', (req, res) => {
    const insights = readData('cost_insights.json');
    if (!insights) return res.status(404).json({ error: 'Cost insights not found' });
    res.json(insights);
});

// ─── Disease Insights (Bubble + Line + Funnel) ───────────────────────────────
app.get('/api/analytics/disease-insights', (req, res) => {
    const data = readData('disease_insights.json');
    if (!data) return res.status(404).json({ error: 'Data not found' });
    res.json(data);
});

// ─── Testimonials ────────────────────────────────────────────────────────────
app.get('/api/testimonials', (req, res) => {
    const data = readData('testimonials.json');
    res.json(data || []);
});

app.post('/api/testimonials', (req, res) => {
    const testimonials = readData('testimonials.json') || [];
    const newTestimonial = { 
        ...req.body, 
        id: Date.now(), 
        createdAt: new Date().toISOString() 
    };
    testimonials.unshift(newTestimonial);
    writeData('testimonials.json', testimonials);
    res.status(201).json(newTestimonial);
});

// ─── Dashboard Summary (Revenue + Alerts) ────────────────────────────────────
app.get('/api/analytics/dashboard-summary', (req, res) => {
    const data = readData('dashboard_revenue.json');
    if (!data) return res.status(404).json({ error: 'Dashboard data not found' });
    res.json(data);
});

// ─── Shared Audit Logger ───────────────────────────────────────────────────
const logAudit = (email, event, status = 'success', details = '') => {
    const logs = readData('audit_logs.json') || [];
    const newLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        email,
        event,
        status,
        details
    };
    logs.unshift(newLog);
    // Keep only last 100 logs
    writeData('audit_logs.json', logs.slice(0, 100));
};

// ─── Authentication Routes ───────────────────────────────────────────────────

// Password Change
app.post('/api/auth/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const authHeader = req.headers.authorization;
        
        if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            logAudit(user.email, 'Password Change Attempt', 'failed', 'Incorrect current password');
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        logAudit(user.email, 'Password Changed Successfully', 'success');
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── Audit Logging Routes ────────────────────────────────────────────────────
app.get('/api/audit/logs', async (req, res) => {
    const logs = readData('audit_logs.json') || [];
    res.json(logs);
});

app.post('/api/audit/log-event', async (req, res) => {
    const { email, event, status, details } = req.body;
    logAudit(email, event, status, details);
    res.status(201).json({ message: 'Event logged' });
});

app.listen(PORT, () => console.log(`🏥 CapacityCare Local API running on http://localhost:${PORT}`));
