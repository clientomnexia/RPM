const express = require('express');
const router = express.Router();
const { getFranchises, getFranchiseById, createFranchise, updateFranchise, deleteFranchise } = require('../controllers/franchiseController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getFranchises).post(protect, admin, createFranchise);
router.route('/:id').get(getFranchiseById).put(protect, admin, updateFranchise).delete(protect, admin, deleteFranchise);

module.exports = router;
