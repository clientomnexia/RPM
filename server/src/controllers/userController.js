const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const { email, password } = req.body;
const normalizedEmail = email.toLowerCase();

try {
    console.log(`ATTEMPTING LOGIN: ${normalizedEmail}`);
    const user = await User.findOne({ email: normalizedEmail });

    if (user) {
        const isMatch = await user.matchPassword(password);
        console.log(`USER FOUND: ${normalizedEmail}, MATCH: ${isMatch}, ADMIN: ${user.isAdmin}`);

        if (isMatch) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        }
    }

    console.log(`Login attempt for ${email}: Failed`);
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
