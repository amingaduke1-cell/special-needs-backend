const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

router.post('/', contactController.createContact);
router.get('/', protect, contactController.getContacts);
router.delete('/:id', protect, contactController.deleteContact);

module.exports = router;