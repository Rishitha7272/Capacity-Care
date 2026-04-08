const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalPatients: { type: Number, default: 0 },
  icuOccupancy: { type: Number, default: 0 },
  avgWaitTime: { type: Number, default: 0 },
  satisfactionScore: { type: Number, default: 0 },
  bedsAvailable: { type: Number, default: 0 },
  staffOnDuty: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
