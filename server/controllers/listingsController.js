// server/controllers/listingController.js
const Listing = require('../models/Listing');
// Получение объявлений текущего пользователя
const getMyListings = async (req, res) => {
  console.log('\n📂 === ЗАПРОС МОИХ ОБЪЯВЛЕНИЙ ===');
  console.log('👤 ID пользователя из токена:', req.user._id);

  try {
    const listings = await Listing.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .select('title price city address specs description images createdAt');

    console.log(`✅ Найдено объявлений: ${listings.length}`);
    res.json({
      status: 'success',
      listings
    });

    console.log('📂 === ЗАПРОС ЗАВЕРШЁН ===\n');
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