const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// ✅ Place static routes BEFORE dynamic routes
router.get('/all', async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dynamic route (must come AFTER /all)
router.get('/:restaurantId', async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
