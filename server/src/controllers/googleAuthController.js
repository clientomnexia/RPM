const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Google OAuth Authentication Controller
 * Verifies Google ID token and creates/finds user in database.
 * Returns a JWT for subsequent authenticated requests.
 */
const googleLogin = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
    }

    try {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Find existing user by googleId or email
        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update Google info if user exists but doesn't have googleId
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new user from Google profile
            user = await User.create({
                name,
                email,
                googleId,
                avatar: picture,
                isAdmin: false,
            });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || picture,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('GOOGLE AUTH ERROR:', error.message);
        res.status(401).json({
            message: 'Google authentication failed',
            error: error.message,
        });
    }
};

module.exports = { googleLogin };
