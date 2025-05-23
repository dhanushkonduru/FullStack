require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  // <-- Added this line

const candidateRoutes = require('./routes/candidates');
const voteRoutes = require('./routes/votes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(express.json());

app.use('/candidates', candidateRoutes);
app.use('/votes', voteRoutes);
app.use('/auth', authRoutes);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
