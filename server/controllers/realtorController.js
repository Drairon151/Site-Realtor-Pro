// server/controllers/realtorController.js
const Realtor = require('../models/Realtor');
const User = require('../models/User');

const getRealtorData = async (req, res) => {
  try {
    const userId = req.user._id;

    let realtor = await Realtor.findOne({ userId });

    if (!realtor) {
      realtor = new Realtor({ userId });
      await realtor.save();
    }

    res.json({
      status: 'success',
      realtorData: realtor 
    });

  } catch (err) {
    console.error('💥 Ошибка при получении данных риелтора:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при получении данных риелтора'
    });
  }
};

const changeRealtorData = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = req.body;

    const numericFields = ['successfulTransactions', 'priceList'];
    for (const field of numericFields) {
      if (data[field] !== undefined) {
        const num = Number(data[field]);
        if (isNaN(num) || !isFinite(num) || num < 0) {
          return res.status(400).json({
            status: 'error',
            message: `Поле "${field}" должно быть неотрицательным числом`
          });
        }
        data[field] = num;
      }
    }

    const requiredStringFields = ['city'];
    for (const field of requiredStringFields) {
      const val = data[field];
      if (val === undefined || val === null || typeof val !== 'string' || val.trim() === '') {
        return res.status(400).json({
          status: 'error',
          message: `Поле "${field}" обязательно и должно быть непустой строкой`
        });
      }
    }

    let realtor = await Realtor.findOne({ userId });

    const updateData = {
      successfulTransactions: data.successfulTransactions ?? 0,
      realtorDescription: typeof data.realtorDescription === 'string' ? data.realtorDescription : '',
      city: data.city.trim(),
      priceList: data.priceList ?? 0,
    };

    if (realtor) {
      realtor.set(updateData);
      await realtor.save();
    } else {
      updateData.userId = userId;
      realtor = new Realtor(updateData);
      await realtor.save();
    }

    res.json({ status: 'success', message: 'Данные риелтора сохранены' });

  } catch (err) {
    console.error('💥 Ошибка при сохранении данных риелтора:', err);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

const getRealtors = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, sort = 'lowPrice', page = 1 } = req.query;

    const validSortValues = ['lowPrice', 'highPrice', 'lessDeals', 'moreDeals'];
    if (!validSortValues.includes(sort)) {
      return res.status(400).json({
        status: 'error',
        message: 'Некорректный параметр сортировки'
      });
    }

    const limit = 12;
    const skip = (Number(page) - 1) * limit;

    const filter = {};

    if (city) {
      filter.city = new RegExp(`^${city.trim().toLowerCase()}$`, 'i');
    }

    if (minPrice || maxPrice) {
      filter.priceList = {};
      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (!isNaN(min)) filter.priceList.$gte = min;
      if (!isNaN(max)) filter.priceList.$lte = max;
    }

    const sortMapping = {
      lowPrice: { priceList: 1 },
      highPrice: { priceList: -1 },
      lessDeals: { successfulTransactions: 1 },
      moreDeals: { successfulTransactions: -1 },
    };

    const realtors = await Realtor.find(filter)
      .populate('userId', 'name surname patronymic avatarUrl')
      .sort(sortMapping[sort])
      .skip(skip)
      .limit(limit);

    const enrichedRealtors = realtors.map(realtor => ({
      _id: realtor._id,
      userId: realtor.userId._id,

      name: realtor.userId.name,
      surname: realtor.userId.surname,
      patronymic: realtor.userId.patronymic,
      avatarUrl: realtor.userId.avatarUrl,

      successfulTransactions: realtor.successfulTransactions,
      realtorDescription: realtor.realtorDescription,
      city: realtor.city,
      priceList: realtor.priceList,

      createdAt: realtor.createdAt,
      updatedAt: realtor.updatedAt,
    }));

    const total = await Realtor.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      status: 'success',
      realtors: enrichedRealtors,
      pagination: {
        page: Number(page),
        totalPages,
        total
      }
    });

  } catch (err) {
    console.error('💥 Ошибка при получении риелторов:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера при загрузке риелторов'
    });
  }
};

module.exports = {
  getRealtorData,
  changeRealtorData,
  getRealtors,
};