const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('./config/db');

// Import Routes
const productRoutes = require('./routes/productRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const { protect, admin } = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Database on each request (uses cached connection in db.js)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('DATABASE ERROR:', error.message);
        res.status(500).json({
            message: 'Database connection failed',
            error: error.message,
            stack: process.env.NODE_ENV === 'production' ? null : error.stack
        });
    }
});

// Public Routes
app.use('/api/products', productRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// Protected Admin Routes
app.use('/api/orders', protect, admin, orderRoutes);

// Health Check
app.get('/api', (req, res) => {
    res.send('Raj Pan Mahal API is running');
});

// For local development only
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
