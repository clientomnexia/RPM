const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection with URI:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('SUCCESS: MongoDB Connected successfully');
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: MongoDB Connection failed');
        console.error(error);
        process.exit(1);
    }
};

testConnection();
