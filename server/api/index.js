const express = require('express'); // Initializing Express
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = require('../src/config/db');

// Import Routes
const productRoutes = require('../src/routes/productRoutes');
const categoryRoutes = require('../src/routes/categoryRoutes');
const franchiseRoutes = require('../src/routes/franchiseRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const contactRoutes = require('../src/routes/contactRoutes');
const userRoutes = require('../src/routes/userRoutes');
const authRoutes = require('../src/routes/authRoutes');

const app = express();

/**
 * CORS Configuration
 * Allows requests from frontend, admin, and localhost (dev).
 * ALLOWED_ORIGINS env var can override with comma-separated URLs.
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
    : [
        'https://rpm-frontend-ten.vercel.app', // Frontend (production)
        'https://rpm-admin.vercel.app',        // Admin (production)
        'http://localhost:5173',               // Frontend (dev)
        'http://localhost:5174',               // Admin (dev)
    ];

app.use(cors({
    origin: true,
    credentials: true,
}));
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
const seedRoutes = require('../src/routes/seedRoutes');
app.use('/api/seed', seedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); // Auth handled per-route in orderRoutes.js

// Health Check
app.get('/api', (req, res) => {
    res.send('Raj Pan Mahal API is running');
});

// Category Health Check
app.get('/api/category-check', async (req, res) => {
    try {
        const Category = require('../src/models/Category');
        const count = await Category.countDocuments();
        res.json({ status: 'ok', count });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message, stack: error.stack });
    }
});

// Cloudinary Config Check
app.get('/api/cloudinary-check', (req, res) => {
    const config = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
        api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
        api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
    };
    
    const isReady = Object.values(config).every(v => v === 'SET');
    
    res.json({
        status: isReady ? 'configured' : 'incomplete',
        config,
        tip: isReady ? 'Configuration looks good!' : 'Please add your Cloudinary credentials to Vercel Environment Variables.'
    });
});

// Default Error Handler
app.use((err, req, res, next) => {
    console.error(`GLOBAL ERROR [${req.method} ${req.path}]:`, err.message);
    if (err.stack) console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message,
        stack: err.stack // Temporarily show stack even in production
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
