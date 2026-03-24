const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        console.log('CREATE PRODUCT REQUEST:', req.body);
        const { name, description, price, category, stock } = req.body;
        let image = req.body.image;

        if (req.file) {
            console.log('CREATE PRODUCT FILE:', req.file.path);
            image = req.file.path; // Cloudinary URL
        }

        if (!image) {
            return res.status(400).json({ message: 'Product image is required (URL or File)' });
        }

        const product = new Product({ name, description, price, image, category, stock });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('CREATE PRODUCT ERROR:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        console.log('UPDATE PRODUCT REQUEST:', req.params.id, req.body);
        const { name, description, price, category, stock } = req.body;
        let image = req.body.image;

        if (req.file) {
            console.log('UPDATE PRODUCT FILE:', req.file.path);
            image = req.file.path; // Cloudinary URL
        }

        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.image = image || product.image;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('UPDATE PRODUCT ERROR:', error.message);
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
