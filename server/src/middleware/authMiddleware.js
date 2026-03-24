const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                console.warn(`AUTH ERROR: User with ID ${decoded.id} not found in database.`);
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            req.user = user;
            return next();
        } catch (error) {
            console.error('JWT VERIFICATION FAILED:', error.message);
            const message = error.name === 'TokenExpiredError' 
                ? 'Not authorized, token expired. Please log in again.' 
                : 'Not authorized, token invalid';
            return res.status(401).json({ message });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token provided' });
};

const admin = (req, res, next) => {
    try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rpm.com').toLowerCase();
        
        if (req.user) {
            const userEmail = (req.user.email || '').toLowerCase();
            const isAdmin = req.user.isAdmin || userEmail === adminEmail;
            
            console.log(`ADMIN CHECK: User=${userEmail}, IsAdminField=${req.user.isAdmin}, MasterEmailMatch=${userEmail === adminEmail}, Result=${isAdmin}`);
            
            if (isAdmin) {
                return next();
            }
        }
        
        console.warn(`Admin access denied for: ${req.user ? req.user.email : 'Unknown'}`);
        return res.status(403).json({ message: 'Access denied: Requires administrator privileges' });
    } catch (error) {
        console.error('ADMIN MIDDLEWARE ERROR:', error.message);
        return res.status(500).json({ 
            message: 'Internal server error in admin middleware', 
            error: error.message 
        });
    }
};

module.exports = { protect, admin };
