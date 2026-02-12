// server/models/Realtor.js
const mongoose = require('mongoose');

const realtorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  // Только данные, специфичные для риелтора
  successfulTransactions: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  realtorDescription: { 
    type: String, 
    default: '' 
  },
  city: { 
    type: String, 
    default: '' 
  },
  priceList: { 
    type: Number, 
    default: 0,
    min: 0 
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Realtor', realtorSchema);