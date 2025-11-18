const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate('items.menuItemId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.menuItemId.price * item.quantity;
    }, 0);

    const newOrder = new Order({
      userId,
      restaurantId: cart.restaurantId,
      items: cart.items,
      totalPrice,
      eta: '30 minutes', // static for now
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('items.menuItemId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
