const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/place', auth, placeOrder);
router.get('/my-orders', auth, getOrders);
router.put('/:orderId/status', auth, updateOrderStatus); // (admin or delivery)

module.exports = router;
