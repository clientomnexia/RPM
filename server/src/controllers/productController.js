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
        const { name, description, price, category, stock } = req.body;
        
        // Image can come from file upload (Cloudinary) or direct URL
        let image = req.body.image;
        if (req.file) {
            image = req.file.path;
        }

        if (!name || !price || !category || !image) {
            return res.status(400).json({ message: 'Please provide all required fields: name, price, category, and image' });
        }

        const product = new Product({
            name,
            description: description || '',
            price: Number(price),
            image,
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
        const { name, description, price, category, stock } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Handle image update (multipart or URL)
        let image = req.body.image;
        if (req.file) {
            image = req.file.path;
        }

        product.name = name || product.name;
        product.description = description !== undefined ? description : product.description;
        product.price = price !== undefined ? Number(price) : product.price;
        product.category = category || product.category;
        product.stock = stock !== undefined ? Number(stock) : product.stock;
        if (image) product.image = image;

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
