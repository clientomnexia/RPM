const express = require('express');
const router = express.Router();
const { createContact, getContacts, deleteContact } = require('../controllers/contactController');

const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getContacts).post(createContact);
router.route('/:id').delete(protect, admin, deleteContact);

module.exports = router;
