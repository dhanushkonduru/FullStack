require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bookRoutes = require('./routes/books');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);
app.use(express.static(path.join(__dirname, 'public')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
