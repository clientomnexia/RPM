const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');

// Import Routes
const productRoutes = require('../routes/productRoutes');
const franchiseRoutes = require('../routes/franchiseRoutes');
const orderRoutes = require('../routes/orderRoutes');
const contactRoutes = require('../routes/contactRoutes');
const userRoutes = require('../routes/userRoutes');
const { protect, admin } = require('../middleware/authMiddleware');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Public Routes (GET only for some)
app.use('/api/products', productRoutes); // Controller should handle public GET vs admin POST/PUT/DELETE
app.use('/api/franchise', franchiseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);

// Protected Admin Routes
app.use('/api/orders', protect, admin, orderRoutes);

// Health Check
app.get('/api', (req, res) => {
    res.send('Raj Pan Mahal API is running');
});

// Port
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
