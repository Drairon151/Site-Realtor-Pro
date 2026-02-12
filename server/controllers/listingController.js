// server/controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User');
const mongoose = require('mongoose');

const createListing = async (req, res) => {
  console.log('\n🆕🆕🆕 === СОЗДАНИЕ ОБЪЯВЛЕНИЯ С ФОТО (multipart/form-data) ===');
  
  const { title, price, address, city, specs, description } = req.body;
  const files = req.files; // ← файлы уже здесь, как массив буферов

  console.log('Роль автора: ',req.user)


  // 🔒 Проверка роли
  if (req.user.role !== 'realtor') {
    console.log('Только риелтор может создать обьявление')
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

// Получение одного объявления по ID
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
      .populate('author', 'name surname role isDiplomaVerified'); // author — это User

    if (!listing) {
      return res.status(404).json({
        status: 'error',
        message: 'Объявление не найдено'
      });
    }

    const listingData = {
      _id: listing._id,
      title: listing.title,
      price: listing.price,
      address: listing.address,
      city: listing.city,
      specs: listing.specs,
      description: listing.description,
      images: listing.images,
      createdAt: listing.createdAt,
      // 🔑 Добавляем realtor_id — это _id автора (он же риелтор)
      realtor_id: listing.author?._id?.toString() || null,
    };

    res.json({
      status: 'success',
      listing: listingData
    });
  } catch (err) {
    console.error('💥 Ошибка при получении объявления:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// Получение номера телефона автора объявления
const getListingAuthorPhone = async (req, res) => {
  const { id } = req.params;

  // 🔒 Валидация ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Некорректный ID объявления'
    });
  }

  try {
    // 🔍 Находим объявление и запрашиваем только author._id
    const listing = await Listing.findById(id, 'author');
    if (!listing) {
      return res.status(404).json({
        status: 'error',
        message: 'Объявление не найдено'
      });
    }

    // 👤 Получаем номер телефона автора (только если пользователь авторизован!)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Требуется авторизация для просмотра контактов'
      });
    }

    const author = await User.findById(listing.author, 'numberPhone');
    if (!author || !author.numberPhone) {
      return res.status(404).json({
        status: 'error',
        message: 'Номер телефона не указан'
      });
    }

    res.json({
      status: 'success',
      phone: author.numberPhone
    });
  } catch (err) {
    console.error('💥 Ошибка при получении номера телефона:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// Удаление объявления
const deleteListing = async (req, res) => {
  const { id } = req.params;

  // 🔒 1. Валидация ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Некорректный ID объявления'
    });
  }

  try {
    // 🔍 2. Находим объявление
    const listing = await Listing.findById(id);
    if (!listing) {
      console.log('КАПУТ ЧИТИРИСТА ЧИТИРЕ')
      return res.status(404).json({
        status: 'error',
        message: 'Объявление не найдено'
      });
    }

    // 🔐 3. Проверка: может ли пользователь удалять это объявление?
    if (listing.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'У вас нет прав на удаление этого объявления'
      });
    }

    // 🗑 4. Удаляем
    await Listing.findByIdAndDelete(id);
    console.log(`🗑️ Объявление ${id} удалено пользователем ${req.user._id}`);

    res.json({
      status: 'success',
      message: 'Объявление успешно удалено'
    });
  } catch (err) {
    console.error('💥 Ошибка при удалении объявления:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при удалении объявления'
    });
  }
};

module.exports = {
  createListing,
  getListingById,
  getListingAuthorPhone,
  deleteListing,
};