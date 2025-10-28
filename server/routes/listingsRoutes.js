// server/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const listingsController = require('../controllers/listingsController')
router.post('/my', authMiddleware, listingsController.getMyListings);


module.exports = router;