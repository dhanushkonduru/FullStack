const Restaurant = require('../models/Restaurant');

async function createRestaurant(data) {
  return Restaurant.create(data);
}

async function findAllRestaurants(filter = {}) {
  return Restaurant.find(filter);
}

async function findRestaurantById(id) {
  return Restaurant.findById(id);
}

async function updateRestaurantById(id, updates, options = { new: true }) {
  return Restaurant.findByIdAndUpdate(id, updates, options);
}

async function deleteRestaurantById(id) {
  return Restaurant.findByIdAndDelete(id);
}

module.exports = {
  createRestaurant,
  findAllRestaurants,
  findRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};


