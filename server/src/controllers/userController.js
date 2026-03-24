const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authUser = async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    email = email.toLowerCase().trim();
    password = password.trim();

    try {
        console.log(`ATTEMPTING LOGIN: ${email}`);
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await user.matchPassword(password);
            console.log(`USER FOUND: ${email}, MATCH: ${isMatch}, ADMIN: ${user.isAdmin}`);

            if (isMatch) {
                // Master Admin Auto-Promotion
                const adminEmail = (process.env.ADMIN_EMAIL || 'admin@rpm.com').toLowerCase();
                if (user.email && user.email.toLowerCase() === adminEmail && !user.isAdmin) {
                    console.log(`AUTO-PROMOTING MASTER ADMIN: ${user.email}`);
                    user.isAdmin = true;
                    await user.save();
                }

                if (!user.isAdmin) {
                    return res.status(403).json({ message: 'Access denied: You are not an admin' });
                }
                return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user._id),
                });
            }
        }

        console.log(`Login attempt for ${email}: Failed (incorrect credentials)`);
        res.status(401).json({ message: 'Invalid email or password' });
    } catch (error) {
        console.error('AUTH ERROR:', error.message);
        res.status(500).json({
            message: 'Server error during authentication',
            error: error.message
        });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('REGISTER ERROR:', error.message);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

module.exports = { authUser, registerUser };
