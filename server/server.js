// server/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB (пока условное)
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rieltorprofi')
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('❌ DB error:', err));

// Простой маршрут
app.get('/', (req, res) => {
  res.send('🚀 Сервер Риелтор-Профи запущен!');
});

app.listen(PORT, () => {
  console.log(`🔧 Server running on http://localhost:${PORT}`);
});