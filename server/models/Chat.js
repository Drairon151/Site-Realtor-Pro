// server/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {

});

const chatSchema = new mongoose.Schema({
  participant1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  participant2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Уникальный индекс на пару (независимо от порядка)
chatSchema.index({ participant1: 1, participant2: 1 }, { unique: true });

// Валидация: запрет одинаковых участников
chatSchema.pre('validate', function (next) {
  if (this.participant1.equals(this.participant2)) {
    return next(new Error('Participants must be distinct'));
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);