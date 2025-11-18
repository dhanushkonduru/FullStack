const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const requestLogger = require('./middleware/requestLogger');
dotenv.config();
connectDB();

const app = express();

// Allow CORS from all origins (dev only)
app.use(cors({
  origin: '*',           // allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(requestLogger);

// Serve static frontend
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log("Root Route Hit");
  res.send('🍽️ Swiggy Clone API is running');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
