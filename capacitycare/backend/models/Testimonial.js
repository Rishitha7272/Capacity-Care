const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  hospital: { type: String, required: true },
  text: { type: String, required: true },
  avatar: { type: String, required: true },
  rating: { type: Number, default: 5 },
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
