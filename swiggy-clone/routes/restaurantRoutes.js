const express = require('express');
const router = express.Router();
const { createRestaurant, getAllRestaurants } = require('../controllers/restaurantController');
const { validateRestaurantCreate } = require('../middleware/validation');

// TODO: add auth middleware when ready e.g., require('../middleware/authMiddleware')
router.post('/', validateRestaurantCreate, createRestaurant);      // Add new restaurant
router.get('/', getAllRestaurants);      // Get all restaurants

module.exports = router;
