const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDb = require('./config/connectDb');

// Load environment variables
dotenv.config();

// Connect to the database
connectDb();

// Initialize the app
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Log the database URL (for debugging)
console.log('MONGO_URL:', process.env.MONGO_URL);

// API Routes
app.use('/api/v1/transactions', require('./routes/transactionRoute'));
app.use('/api/v1/users', require('./routes/userRoute'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './client/build')));

// Catch-all route to serve React's index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Set the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});