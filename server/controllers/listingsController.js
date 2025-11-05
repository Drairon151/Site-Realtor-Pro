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

// Получение всех публичных объявлений с фильтрацией и сортировкой
const getListings = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, sortBy = 'createdAt', order = 'desc', page = 1 } = req.query;
    const limit = 12; // 12 объявлений на страницу
    const skip = (page - 1) * limit;

    // Формируем фильтр
    const filter = {};
    if (city) filter.city = new RegExp(`^${city.trim().toLowerCase()}$`, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Формируем сортировку
    const sort = {};
    const validSortFields = ['price', 'createdAt'];
    if (validSortFields.includes(sortBy)) {
      sort[sortBy] = order === 'asc' ? 1 : -1;
    } else {
      sort.createdAt = -1; // по умолчанию — новые первыми
    }

    // Запрос с пагинацией
    const listings = await Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name surname role');

    const total = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      listings,
      pagination: { page: Number(page), totalPages, total }
    });
  } catch (err) {
    console.error('💥 Ошибка при получении объявлений:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = {
  getMyListings,
  getListings,
};