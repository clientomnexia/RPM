const Product = require('../models/Product');
const Franchise = require('../models/Franchise');
const User = require('../models/User');
const Category = require('../models/Category');

const seedData = async (req, res) => {
    try {
        await Product.deleteMany();
        await Franchise.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        const email = (process.env.ADMIN_EMAIL || 'admin@rpm.com').toLowerCase();
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        const adminUser = {
            name: 'Admin User',
            email,
            password,
            isAdmin: true
        };

        // Seed categories (matching frontend)
        const categoryNames = ['Classic', 'Traditional', 'Modern', 'Signature', 'Gifts'];
        await Category.insertMany(categoryNames.map(name => ({ name })));

        const products = [
            { name: "Royal Meetha Pan", price: 50, description: "A sweet blend of gulkand, dates, and aromatic spices.", category: "Classic", stock: 100, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500" },
            { name: "Saffron Special", price: 80, description: "Infused with pure saffron for a truly royal experience.", category: "Signature", stock: 50, image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500" },
            { name: "Classic Cigarette", price: 18, description: "Premium tobacco blend.", category: "Classic", stock: 200, image: "https://images.unsplash.com/photo-1559811814-e2c57b5e69df?w=500" },
            { name: "Cool Mint Mouth Freshener", price: 25, description: "Extra fresh minty sensation.", category: "Modern", stock: 150, image: "https://images.unsplash.com/photo-1701743818302-31d79679ccfc?w=500" },
            { name: "Mango Delight Juice", price: 40, description: "Pure mango pulp refreshment.", category: "Modern", stock: 80, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=500" },
            { name: "Spicy Masala Chips", price: 20, description: "Crunchy potato chips with Indian spices.", category: "Traditional", stock: 120, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500" },
            { name: "Royal Combo", price: 150, description: "Royal Pan + Cold Drink + Snacks.", category: "Gifts", stock: 30, image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=500" },
            { name: "Hookah Special Blend", price: 450, description: "Premium flavored tobacco for hookah.", category: "Traditional", stock: 20, image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?w=500" }
        ];

        const franchises = [
            { name: "Silver Franchise", investmentAmount: 50000, requiredArea: "100-150 sq ft", expectedROI: "6-8 Months", duration: "3 Years", description: "Basic setup for small kiosks in high-footfall areas." },
            { name: "Gold Franchise", investmentAmount: 150000, requiredArea: "200-300 sq ft", expectedROI: "10-12 Months", duration: "5 Years", description: "Premium setup for store outlets with interior design support." },
            { name: "Royal Franchise", investmentAmount: 500000, requiredArea: "500+ sq ft", expectedROI: "18-24 Months", duration: "Lifetime", description: "Full-scale luxury franchise with exclusive rights and marketing." }
        ];

        const user = await User.create(adminUser);
        await Product.insertMany(products);
        await Franchise.insertMany(franchises);

        // SELF-TEST: Verify the password matches immediately
        const testMatch = await user.matchPassword(password);
        console.log(`SEED SELF-TEST: Email: ${email}, Match: ${testMatch}`);

        res.json({
            message: 'Data Seeded Successfully!',
            categories: categoryNames,
            credentials: {
                email,
                password,
                note: 'Please use these EXACT credentials to login.'
            },
            selfTest: testMatch ? 'Passed' : 'Failed'
        });
    } catch (error) {
        res.status(500).json({ message: 'Seeding failed', error: error.message });
    }
};

module.exports = { seedData };
