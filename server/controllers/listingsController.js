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
    const { 
      city, 
      minPrice, 
      maxPrice, 
      sort = 'newest', // ← единый параметр
      page = 1 
    } = req.query;

    const limit = 12;
    const skip = (Number(page) - 1) * limit;

    // 🔒 Валидация параметра сортировки
    const validSortValues = ['newest', 'oldest', 'lowPrice', 'highPrice'];
    if (!validSortValues.includes(sort)) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректный параметр сортировки. Допустимые значения: newest, oldest, lowPrice, highPrice'
      });
    }

    // 🔍 Фильтрация
    const filter = {};

    if (city) {
      filter.city = new RegExp(`^${city.trim().toLowerCase()}$`, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // 🧭 Сортировка — единый маппинг
    const sortMapping = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      lowPrice: { price: 1 },
      highPrice: { price: -1 }
    };

    const sortConfig = sortMapping[sort];

    // 📦 Запрос
    const listings = await Listing.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit)
      .populate('author', 'name surname role');

    const total = await Listing.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      listings,
      pagination: {
        page: Number(page),
        totalPages,
        total
      }
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
  getMyListings,
  getListings,
};