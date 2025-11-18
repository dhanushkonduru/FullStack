const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      quantity: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Pending',
  },
  eta: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
