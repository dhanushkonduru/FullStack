const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: String,
  rating: {
    type: Number,
    default: 0,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
