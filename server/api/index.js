const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const connectDB = require('../src/config/db');

// Import Routes
const productRoutes = require('../src/routes/productRoutes');
const franchiseRoutes = require('../src/routes/franchiseRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const contactRoutes = require('../src/routes/contactRoutes');
const userRoutes = require('../src/routes/userRoutes');
const { protect, admin } = require('../src/middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// Health Check & Root Route
app.get('/', (req, res) => {
    res.send('Raj Pan Mahal API is running');
});

// Connect to Database on each request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('SERVERLESS DB ERROR:', error.message);
        res.status(500).json({
            message: 'Database connection failed during request',
            error: error.message,
            tip: 'Check your MONGODB_URI and Atlas Network Access (0.0.0.0/0)'
        });
    }
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', protect, admin, orderRoutes);

// Health Check
app.get('/api', (req, res) => {
    res.send('Raj Pan Mahal API is running');
});

// Default Error Handler
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err.message);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

// Local dev only
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
