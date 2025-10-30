// server/controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User');
const mongoose = require('mongoose');

const createListing = async (req, res) => {
  console.log('\n🆕🆕🆕 === СОЗДАНИЕ ОБЪЯВЛЕНИЯ С ФОТО ===');
  console.log('📥 Тело запроса:', req.body);

  const { title, price, address, city, specs, description } = req.body;

  // 🔒 1. Проверка роли
  if (req.user.role !== 'realtor') {
    return res.status(403).json({
      status: 'error',
      message: 'Только риелторы могут создавать объявления'
    });
  }

  // 🧾 2. Валидация полей
  if (!title || !price || !address || !city || !specs || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'Все поля обязательны'
    });
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0 || priceNum > 500_000_000) {
    return res.status(400).json({
      status: 'error',
      message: 'Некорректная цена'
    });
  }

  if (!/^[а-яА-ЯёЁ\s\-]+$/.test(city.trim())) {
    return res.status(400).json({
      status: 'error',
      message: 'Город должен содержать только кириллицу'
    });
  }

  try {
    // 👤 3. Проверка автора
    const author = await User.findById(req.user._id);
    if (!author) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }

    // 🖼 4. Загрузка фото на ImgBB (если есть)
    let imageUrls = [];
    if (req.body.photos && Array.isArray(req.body.photos)) {
      console.log(`📤 Загрузка ${req.body.photos.length} фото на ImgBB...`);
      const uploadPromises = req.body.photos.map(async (base64Image) => {
        const formData = new URLSearchParams();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64Image); // ImgBB принимает base64

        try {
          const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });

          const data = await response.json();
          if (data.success) {
            console.log('✅ Фото загружено:', data.data.url);
            return data.data.url;
          } else {
            console.warn('⚠️ ImgBB ошибка:', data.error?.message || 'Неизвестная ошибка');
            return null;
          }
        } catch (err) {
          console.error('💥 Ошибка загрузки фото:', err.message);
          return null;
        }
      });

      const results = await Promise.all(uploadPromises);
      imageUrls = results.filter(url => url !== null); // убираем неудачные
      console.log(`✅ Успешно загружено фото: ${imageUrls.length}`);
    }

    // 📦 5. Создание объявления
    const newListing = new Listing({
      title: title.trim(),
      price: priceNum,
      address: address.trim(),
      city: city.trim().toLowerCase(),
      specs: specs.trim(),
      description: description.trim(),
      author: req.user._id,
      images: imageUrls
    });

    await newListing.save();
    console.log('✅ Объявление создано:', newListing._id);

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
        images: newListing.images,
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

// Получение одного объявления по ID
const getListingById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Некорректный ID объявления'
    });
  }

  try {
    const listing = await Listing.findById(id)
      .populate('author', 'name surname role isDiplomaVerified');

    if (!listing) {
      return res.status(404).json({
        status: 'error',
        message: 'Объявление не найдено'
      });
    }

    res.json({
      status: 'success',
      listing
    });
  } catch (err) {
    console.error('💥 Ошибка при получении объявления:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

module.exports = {
  createListing,
  getListingById,
};