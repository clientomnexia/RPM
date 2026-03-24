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
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rpm.com').toLowerCase();
        
        if (req.user) {
            const userEmail = (req.user.email || '').toLowerCase();
            const isAdmin = req.user.isAdmin || userEmail === adminEmail;
            
            console.log(`ADMIN CHECK: User=${userEmail}, IsAdminField=${req.user.isAdmin}, Result=${isAdmin}`);
            
            if (isAdmin) {
                return next();
            }
        }
        
        console.warn(`Admin access denied for user: ${req.user ? req.user.email : 'Unknown'}`);
        return res.status(401).json({ message: 'Not authorized as an admin' });
    } catch (error) {
        console.error('ADMIN MIDDLEWARE ERROR:', error.message);
        return res.status(500).json({ 
            message: 'Internal server error in admin middleware', 
            error: error.message 
        });
    }
};

module.exports = { protect, admin };
