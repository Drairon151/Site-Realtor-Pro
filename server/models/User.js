// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
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
  isVerified: {
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
  }
}, {
  timestamps: true // createdAt, updatedAt
});

module.exports = mongoose.model('User', userSchema);