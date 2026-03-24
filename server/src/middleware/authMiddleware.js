const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
};

const admin = (req, res, next) => {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rpm.com').toLowerCase();
    
    if (req.user && (req.user.isAdmin || req.user.email.toLowerCase() === adminEmail)) {
        next();
    } else {
        console.warn(`Admin access denied for user: ${req.user ? req.user.email : 'Unknown'}`);
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };
