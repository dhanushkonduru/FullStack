const restaurantService = require('../services/restaurantService');

exports.createRestaurant = async (req, res) => {
  try {
    const newRestaurant = await restaurantService.createRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
