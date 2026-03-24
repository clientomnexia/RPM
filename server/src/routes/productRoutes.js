const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const uploadMiddleware = (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('MULTER ERROR:', err);
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            console.error('CLOUDINARY/UNKNOWN UPLOAD ERROR:', err);
            const errorMessage = err.message || (typeof err === 'string' ? err : JSON.stringify(err));
            return res.status(500).json({ message: `Image upload failed: ${errorMessage}` });
        }
        next();
    });
};

router.route('/')
    .get(getProducts)
    .post(protect, admin, uploadMiddleware, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, uploadMiddleware, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
