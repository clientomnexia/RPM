const Product = require('../models/Product');

/**
 * @desc    Fetch all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('FETCH PRODUCTS ERROR:', error.message);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('FETCH PRODUCT BY ID ERROR:', error.message);
        res.status(500).json({ message: 'Server error while fetching product details' });
    }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = async (req, res) => {
    try {
        console.log('CREATE PRODUCT - USER:', req.user ? req.user.email : 'NO USER');
        console.log('CREATE PRODUCT - BODY:', req.body);
        console.log('CREATE PRODUCT - FILE:', req.file ? req.file.path : 'NO FILE');

        const { name, description, price, category, stock, imageUrls } = req.body;
        
        // Handle images (multiple files and URLs)
        const images = [];

        // Add uploaded files
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => images.push(file.path));
        }

        // Add provided URLs
        if (imageUrls) {
            const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
            urls.forEach(url => {
                if (url && typeof url === 'string' && url.trim()) {
                    images.push(url.trim());
                }
            });
        }

        if (!name || !price || !category || images.length === 0) {
            return res.status(400).json({ message: 'Please provide all required fields: name, price, category, and at least one image' });
        }

        const product = new Product({
            name,
            description: description || '',
            price: Number(price),
            image: images[0], // Primary image
            images: images,   // All images
            category,
            stock: Number(stock) || 0
        });

        const createdProduct = await product.save();
        console.log(`PRODUCT CREATED: ${createdProduct.name} by ${req.user.email}`);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('CREATE PRODUCT ERROR:', error.message);
        res.status(400).json({ message: error.message || 'Failed to create product' });
    }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrls } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image updates
        let newImages = [];

        // If files are uploaded, use them. 
        // Note: For update, we might want to APPEND or REPLACE. 
        // The user request says "allow admin to add more than one picture".
        // Usually, in an update form, if the user uploads new ones, they might want to replace the old ones or add to them.
        // Given the prompt "allow admin to add more than one picture", let's make it easy to manage.
        // If imageUrls is provided, it should reflect the NEW state of URLs.
        
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => newImages.push(file.path));
        }

        if (imageUrls) {
            const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
            urls.forEach(url => {
                if (url && typeof url === 'string' && url.trim()) {
                    newImages.push(url.trim());
                }
            });
        }

        product.name = name || product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price !== undefined ? Number(price) : product.price;
        product.category = category || product.category;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        
        if (newImages.length > 0) {
            product.images = newImages;
            product.image = newImages[0];
        }

        const updatedProduct = await product.save();
        console.log(`PRODUCT UPDATED: ${updatedProduct.name} by ${req.user.email}`);
        res.json(updatedProduct);
    } catch (error) {
        console.error('UPDATE PRODUCT ERROR:', error.message);
        res.status(400).json({ message: error.message || 'Failed to update product' });
    }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        console.log(`PRODUCT DELETED: ${req.params.id} by ${req.user.email}`);
        res.json({ message: 'Product successfully removed' });
    } catch (error) {
        console.error('DELETE PRODUCT ERROR:', error.message);
        res.status(500).json({ message: 'Failed to delete product' });
    }
};

module.exports = { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};
