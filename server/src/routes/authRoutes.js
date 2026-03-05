const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/googleAuthController');

// POST /api/auth/google — Google OAuth login
router.post('/google', googleLogin);

module.exports = router;
