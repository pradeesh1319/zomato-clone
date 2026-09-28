const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, default: '' },
  image: { type: String, default: '' },
});

const menuCategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  items: [menuItemSchema],
});

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    deliveryTime: { type: Number, default: 30 },
    priceForTwo: { type: Number, default: 300 },
    image: { type: String, default: '' },
    location: { type: String, default: '' },
    isOpen: { type: Boolean, default: true },
    menu: [menuCategorySchema],
  },
  { timestamps: true }
);

// Enable text index for search
restaurantSchema.index({ name: 'text', cuisine: 'text', location: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
