const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');
const {
  createRestaurant,
  createMenuItem,
  viewAllOrders,
  updateAnyOrderStatus
} = require('../controllers/adminController');

// ✅ Admin: Create restaurant
router.post('/restaurant', auth, isAdmin, createRestaurant);

// ✅ Admin: Add menu item to a restaurant
router.post('/restaurant/:id/menu', auth, isAdmin, createMenuItem);

// ✅ Admin: View all orders
router.get('/orders', auth, isAdmin, viewAllOrders);

// ✅ Admin: Update any order status
router.put('/orders/:orderId/status', auth, isAdmin, updateAnyOrderStatus);

module.exports = router;
