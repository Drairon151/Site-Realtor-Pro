// server/models/Chat.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
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
  _id: false,
  id: false,
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Уникальный чат между двумя людьми
chatSchema.index({ participants: 1 }, { unique: true });

// Валидация: 2 разных участника
chatSchema.pre('validate', function (next) {
  const ids = this.participants.map(id => id.toString());
  if (new Set(ids).size !== 2) {
    return next(new Error('Chat must have exactly 2 distinct participants'));
  }
  // Сортируем для уникальности индекса
  this.participants = ids.sort().map(id => new mongoose.Types.ObjectId(id));
  next();
});
// В конце server/models/Chat.js, перед module.exports:
chatSchema.statics.findOrCreate = async function (conditions) {
  let doc = await this.findOne(conditions);
  if (doc) return [doc, false];
  doc = await this.create(conditions);
  return [doc, true];
};
module.exports = mongoose.model('Chat', chatSchema);