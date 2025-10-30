// server/controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User');
const mongoose = require('mongoose');

const createListing = async (req, res) => {
  console.log('\n🆕🆕🆕 === СОЗДАНИЕ ОБЪЯВЛЕНИЯ С ФОТО (multipart/form-data) ===');
  
  const { title, price, address, city, specs, description } = req.body;
  const files = req.files; // ← файлы уже здесь, как массив буферов

  console.log('Данные обьявления: ',req.body)
  console.log('Файлы обьявления: ',files)


  // 🔒 Проверка роли
  if (req.user.role !== 'realtor') {
    return res.status(403).json({ message: 'Только риелторы могут создавать объявления' });
  }

  // 🧾 Валидация полей
  if (!title || !price || !address || !city || !specs || !description) {
    console.log('Все поля обязательны')
    return res.status(400).json({ message: 'Все поля обязательны' });
  }

  const priceNum = Number(price);
  if (isNaN(priceNum) || priceNum <= 0 || priceNum > 500_000_000) {
    console.log('Некоректная ценя')
    return res.status(400).json({ message: 'Некорректная цена' });
  }

  if (!/^[а-яА-ЯёЁ\s\-]+$/.test(city.trim())) {
    console.log('Город должен содержать только кирилицу')
    return res.status(400).json({ message: 'Город должен содержать только кириллицу' });
  }

  try {
    // 👤 Проверка автора
    const author = await User.findById(req.user._id);
    if (!author) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // 🖼 Загрузка фото в ImgBB (только если есть файлы)
    let imageUrls = [];
    if (files && files.length > 0) {
      console.log(`📤 Загрузка ${files.length} фото в ImgBB...`);
      for (const file of files) {
        const base64 = file.buffer.toString('base64'); // ← буфер → base64 (только для ImgBB)

        const formData = new URLSearchParams();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64);

        try {
          const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });

          const data = await response.json();
          if (data.success) {
            imageUrls.push(data.data.url);
            console.log('✅ Фото загружено:', data.data.url);
          } else {
            console.warn('⚠️ ImgBB ошибка:', data.error?.message);
          }
        } catch (err) {
          console.error('💥 Ошибка загрузки фото:', err.message);
        }
      }
    }

    // 📦 Создание объявления
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
    res.status(500).json({ message: 'Ошибка сервера при создании объявления' });
  }
};

module.exports = { createListing };

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