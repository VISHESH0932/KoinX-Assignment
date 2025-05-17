require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const natsService = require('./services/natsService');
const cryptoRoutes = require('./routes/cryptoRoutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Connect to NATS and subscribe to updates
natsService.connectToNats();

// Middleware
app.use(express.json());

// Routes
app.use('/', cryptoRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
}); 