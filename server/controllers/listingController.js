// server/controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User');

// Создание объявления
const createListing = async (req, res) => {
  console.log('\n🆕🆕🆕 === СОЗДАНИЕ ОБЪЯВЛЕНИЯ ===');
  console.log('📥 Данные от клиента:', req.body);

  const { title, price, address, city, specs, description } = req.body;

  // 🔒 1. Проверка роли (только риелтор)
  if (req.user.role !== 'realtor') {
    console.log('❌ Доступ запрещён: пользователь не риелтор', req.user._id);
    return res.status(403).json({
      status: 'error',
      message: 'Только риелторы могут создавать объявления'
    });
  }

  // 🧾 2. Валидация обязательных полей
  if (!title || !price || !address || !city || !specs || !description) {
    console.log('❌ Отсутствуют обязательные поля');
    return res.status(400).json({
      status: 'error',
      message: 'Все поля обязательны для заполнения'
    });
  }

  // 💰 3. Валидация цены
  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0 || priceNum > 500_000_000) {
    console.log('❌ Некорректная цена:', price);
    return res.status(400).json({
      status: 'error',
      message: 'Цена должна быть числом от 1 до 500 000 000'
    });
  }

  // 🌍 4. Валидация города (только кириллица и пробелы)
  if (!/^[а-яА-ЯёЁ\s\-]+$/.test(city.trim())) {
    console.log('❌ Некорректный город:', city);
    return res.status(400).json({
      status: 'error',
      message: 'Город должен содержать только кириллицу'
    });
  }

  try {
    // 👤 5. Проверка существования автора
    const author = await User.findById(req.user._id);
    if (!author) {
      console.log('❌ Автор не найден:', req.user._id);
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }

    // 📦 6. Создание объявления
    const newListing = new Listing({
      title: title.trim(),
      price: priceNum,
      address: address.trim(),
      city: city.trim().toLowerCase(),
      specs: specs.trim(),
      description: description.trim(),
      author: req.user._id,
      images: [] // ← фото пока не загружаются (будет отдельно)
    });

    await newListing.save();
    console.log('✅ Объявление создано:', newListing._id);

    // 📍 7. Формируем URL для редиректа
    const listingURL = `/listing/${newListing._id}`;

    res.status(201).json({
      status: 'success',
      message: 'Объявление успешно создано',
      listingURL,
      listing: {
        _id: newListing._id,
        title: newListing.title,
        price: newListing.price,
        city: newListing.city,
        createdAt: newListing.createdAt
      }
    });

    console.log('🆕🆕🆕 === СОЗДАНИЕ ЗАВЕРШЕНО ===\n');
  } catch (err) {
    console.error('💥 Ошибка при создании объявления:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при создании объявления'
    });
  }
};

module.exports = {
  createListing
};