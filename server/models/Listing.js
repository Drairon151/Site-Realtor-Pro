// server/models/Listing.js
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  // Основное
  title: { type: String, required: true, trim: true }, // «Коттедж в Красной Поляне»
  description: { type: String, required: true, maxlength: 5000 },
  
  // Адрес и гео
  address: { type: String, required: true },
  city: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true 
  },

  // Характеристики (можно разбить на поля, но для MVP — строка)
  specs: { type: String, required: true }, // «1-эт. дом, 20 м², 27 сот.»

  // Цена
  price: { type: Number, required: true, min: 0 },

  // Медиа
  images: [{
    type: String, // URL изображения (Cloudinary, ImgBB и т.д.)
    required: true
  }],

  // Автор — ссылка на риелтора
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Дата создания
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
}, {
  timestamps: true
});

// Индексы для поиска
listingSchema.index({ city: 1, price: 1 });
listingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);