const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Unknown Doctor'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true,
        default: 'CapacityCare'
    },
    department: {
        type: String,
        default: 'General Medicine'
    },
    contact: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'staff', 'Doctor'], // Support both casings
        default: 'doctor'
    },
    stats: {
        patientsMonth: { type: Number, default: 0 },
        avgTreatmentTime: { type: String, default: '0' },
        deptContribution: { type: String, default: '0' },
        efficiencyScore: { type: Number, default: 0 },
        lastLogin: { type: Date }
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
