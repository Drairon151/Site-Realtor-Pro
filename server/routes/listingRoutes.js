// server/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const listingController = require('../controllers/listingController');

// POST /api/listing → создание одного объявления
router.post('/createListing', authMiddleware, listingController.createListing);
router.post('/:id', authMiddleware, listingController.getListingById);

// GET /api/listings → список объявлений (будет позже)
// router.get('/listings', listingController.getListings);

module.exports = router;