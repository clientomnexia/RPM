const mongoose = require('mongoose');

const connectDB = async () => {
    // Check if already connected (readyState 1)
    if (mongoose.connection.readyState >= 1) {
        console.log('Using existing database connection');
        return;
    }

    try {
        if (!process.env.MONGODB_URI) {
            console.error('FATAL ERROR: MONGODB_URI is not defined in environment variables');
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        console.log('Attempting new database connection...');
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`CRITICAL DATABASE ERROR: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
