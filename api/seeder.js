const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');
const Franchise = require('./models/Franchise');
const User = require('./models/User');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const importData = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            console.error('ERROR: MONGODB_URI is not defined in your root .env file.');
            process.exit(1);
        }

        if (uri.includes('localhost')) {
            console.warn('WARNING: You are seeding a LOCAL database. To seed production, update MONGODB_URI in the root .env to your Atlas string.');
        }

        console.log('Connecting to database for seeding...');
        await mongoose.connect(uri);
        console.log('Connected!');

        console.log('Cleaning existing data...');
        await Product.deleteMany();
        await Franchise.deleteMany();
        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                isAdmin: true
            },
        ];

        const products = [
            { name: "Royal Meetha Pan", price: 50, description: "A sweet blend of gulkand, dates, and aromatic spices.", category: "Pan", stock: 100, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400" },
            { name: "Saffron Special", price: 80, description: "Infused with pure saffron for a truly royal experience.", category: "Pan", stock: 50, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400" },
            { name: "Classic Cigarette", price: 18, description: "Premium tobacco blend.", category: "Cigarettes", stock: 200, image: "https://images.unsplash.com/photo-1559811814-e2c57b5e69df?w=400" },
            { name: "Cool Mint Mouth Freshener", price: 25, description: "Extra fresh minty sensation.", category: "Tobacco", stock: 150, image: "https://via.placeholder.com/400" },
            { name: "Mango Delight Juice", price: 40, description: "Pure mango pulp refreshment.", category: "Cold drinks", stock: 80, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400" },
            { name: "Spicy Masala Chips", price: 20, description: "Crunchy potato chips with Indian spices.", category: "Snacks", stock: 120, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400" },
            { name: "Royal Combo", price: 150, description: "Royal Pan + Cold Drink + Snacks.", category: "Combo", stock: 30, image: "https://via.placeholder.com/400" },
            { name: "Hookah Special Blend", price: 450, description: "Premium flavored tobacco for hookah.", category: "Tobacco", stock: 20, image: "https://via.placeholder.com/400" }
        ];

        const franchises = [
            { name: "Silver Franchise", investmentAmount: 50000, requiredArea: "100-150 sq ft", expectedROI: "6-8 Months", duration: "3 Years", description: "Basic setup for small kiosks in high-footfall areas." },
            { name: "Gold Franchise", investmentAmount: 150000, requiredArea: "200-300 sq ft", expectedROI: "10-12 Months", duration: "5 Years", description: "Premium setup for store outlets with interior design support." },
            { name: "Royal Franchise", investmentAmount: 500000, requiredArea: "500+ sq ft", expectedROI: "18-24 Months", duration: "Lifetime", description: "Full-scale luxury franchise with exclusive rights and marketing." }
        ];

        console.log('Seeding users...');
        for (const user of users) {
            const newUser = new User(user);
            await newUser.save();
        }

        console.log('Seeding products and franchises...');
        await Product.insertMany(products);
        await Franchise.insertMany(franchises);

        console.log('Data Successfully Imported!');
        process.exit();
    } catch (error) {
        console.error(`SEEDING ERROR: ${error.message}`);
        process.exit(1);
    }
};

importData();
