const restaurantRepository = require('../repositories/restaurantRepository');

async function createRestaurant(input) {
  return restaurantRepository.createRestaurant(input);
}

async function getAllRestaurants() {
  return restaurantRepository.findAllRestaurants();
}

async function getRestaurantById(id) {
  return restaurantRepository.findRestaurantById(id);
}

async function updateRestaurant(id, updates) {
  return restaurantRepository.updateRestaurantById(id, updates);
}

async function removeRestaurant(id) {
  return restaurantRepository.deleteRestaurantById(id);
}

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  removeRestaurant,
};


