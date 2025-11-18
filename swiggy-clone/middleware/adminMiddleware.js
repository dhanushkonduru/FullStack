const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied: Admins only.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = isAdmin;
