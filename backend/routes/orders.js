const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders — Place a new order
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, restaurantId, restaurantName, items } = req.body;

    if (!customerName || !phone || !address || !restaurantId || !restaurantName || !items?.length) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      customerName,
      phone,
      address,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      status: 'placed',
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders — Get all orders (latest first)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id — Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
