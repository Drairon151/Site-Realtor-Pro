// server/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const listingsController = require('../controllers/listingsController')
router.get('/my', authMiddleware, listingsController.getMyListings);
router.get('/all', listingsController.getListings);

module.exports = router;