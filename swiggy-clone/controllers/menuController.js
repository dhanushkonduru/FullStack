const MenuItem = require('../models/MenuItem');

exports.addMenuItem = async (req, res) => {
  try {
    const newItem = await MenuItem.create(req.body);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMenuByRestaurant = async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
