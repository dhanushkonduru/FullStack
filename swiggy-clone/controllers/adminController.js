const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = new MenuItem({ ...req.body, restaurantId: id });
    await menuItem.save();

    // Push to restaurant's menu list
    await Restaurant.findByIdAndUpdate(id, { $push: { menu: menuItem._id } });

    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.viewAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId restaurantId items.item');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAnyOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const menuItem = new MenuItem({ ...req.body, restaurantId: id });
    await menuItem.save();

    restaurant.menu.push(menuItem._id);
    await restaurant.save();

    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};