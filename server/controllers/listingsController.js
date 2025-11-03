// server/controllers/listingController.js
const Listing = require('../models/Listing');
// Получение объявлений текущего пользователя
const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name surname role isDiplomaVerified');

    const listingsData = listings.map(listing => ({
      _id: listing._id,
      title: listing.title,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      specs: listing.specs,
      description: listing.description,
      images: listing.images,
      createdAt: listing.createdAt // ← добавлено
    }));

    res.json({
      status: 'success',
      listings: listingsData
    });
  } catch (err) {
    console.error('💥 Ошибка при получении объявлений:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при загрузке объявлений'
    });
  }
};

module.exports = {
  getMyListings
};