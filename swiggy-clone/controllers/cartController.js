const Cart = require('../models/Cart');
const MenuItem = require('../models/MenuItem');

// Add or update item in cart
exports.addToCart = async (req, res) => {
  const { itemId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) return res.status(404).json({ error: 'Item not found' });

    let cart = await Cart.findOne({ userId });

    if (cart && cart.restaurantId && cart.restaurantId.toString() !== menuItem.restaurant.toString()) {
      return res.status(400).json({ error: 'Cart can contain items from one restaurant only' });
    }

    if (!cart) {
      cart = new Cart({ userId, restaurantId: menuItem.restaurant, items: [], total: 0 });
    }

    const itemIndex = cart.items.findIndex(i => i.menuItemId.toString() === itemId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ menuItemId: itemId, quantity });
    }

    // Recalculate total
    let total = 0;
    for (let item of cart.items) {
      const menu = await MenuItem.findById(item.menuItemId);
      total += menu.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get cart for current user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.menuItemId');
    if (!cart) return res.json({ items: [], total: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove an item from cart
exports.removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    cart.items = cart.items.filter(item => item.menuItemId.toString() !== req.params.itemId);
    // Recalculate total
    let total = 0;
    for (let item of cart.items) {
      const menu = await MenuItem.findById(item.menuItemId);
      total += menu.price * item.quantity;
    }
    cart.total = total;

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
