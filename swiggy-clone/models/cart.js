const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  },
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      }
    }
  ],
  total: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
