// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  surname: { 
    type: String, 
    required: true 
  },
  patronymic: { 
    type: String, 
    required: true 
  },
  mail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  numberPhone: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['client', 'realtor'],
    default: 'client',
  },
  avatarUrl: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDiplomaVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default: null,
  },
  verificationCodeExpires: {
    type: Date,
    default: null,
  },
  resendAttempts: {
    type: Number,
    default: 0,
  },
  lastVerificationSentAt: {
    type: Date,
    default: null,
  },
  
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);