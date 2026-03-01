const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Use memory storage instead of disk storage for Vercel (read-only filesystem)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
