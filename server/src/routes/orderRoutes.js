const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST / — open to authenticated customers (Google-authed users can place orders)
// GET / — admin only (view all orders)
router.route('/').get(protect, admin, getOrders).post(createOrder);

// GET /:id — admin only
router.route('/:id').get(protect, admin, getOrderById);

module.exports = router;
