function validateRestaurantCreate(req, res, next) {
  const { name } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Restaurant name is required' });
  }
  next();
}

module.exports = {
  validateRestaurantCreate,
};


