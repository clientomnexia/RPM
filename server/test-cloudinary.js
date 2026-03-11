const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const { cloudinary } = require('./src/config/cloudinary');

const testCloudinary = async () => {
    try {
        console.log('Testing Cloudinary configuration...');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

        // This won't actually upload to verify, but will check if config is reachable
        const result = await cloudinary.api.ping();
        console.log('SUCCESS: Cloudinary Ping successful:', result);
        process.exit(0);
    } catch (error) {
        console.error('FAILURE: Cloudinary configuration invalid');
        console.error(error);
        process.exit(1);
    }
};

testCloudinary();
