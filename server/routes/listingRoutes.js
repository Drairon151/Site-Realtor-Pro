// server/routes/listingRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // ← новый middleware
const listingController = require('../controllers/listingController');

// POST /api/listing — создаёт объявление с фото
router.post(
  '/createListing',
  authMiddleware,
  upload.array('photos', 10), // ← принимает до 10 файлов с именем "photos"
  listingController.createListing
);
router.post('/:id', authMiddleware, listingController.getListingById);
router.post('/:id/phone', authMiddleware, listingController.getListingAuthorPhone)
// GET /api/listings → список объявлений (будет позже)
// router.get('/listings', listingController.getListings);

module.exports = router;



