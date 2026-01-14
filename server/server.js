// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
require('dotenv').config();

// === ИМПОРТЫ МИДЛВАРОВ И РОУТОВ ===
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const listingsRoutes = require('./routes/listingsRoutes');
const realtorRoutes = require('./routes/realtorRoutes');
const messagerRoutes = require('./routes/messagerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// === MIDDLEWARE ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// === РОУТЫ ===
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/listing', authMiddleware, listingRoutes);
app.use('/api/listings', authMiddleware, listingsRoutes);
app.use('/api/realtor', realtorRoutes);
app.use('/api', profileRoutes);
app.use('/api/messager', messagerRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Сервер Риелтор-Профи запущен!');
});

// === ИНИЦИАЛИЗАЦИЯ HTTP-СЕРВЕРА ===
const server = http.createServer(app);

// === WEBSOCKET: ПОДКЛЮЧЕНИЕ ПОСЛЕ ВСЕХ РОУТОВ ===
const { initWebSocketServer } = require('./websocket');
initWebSocketServer(server);

// === ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ===
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('❌ DB error:', err));

// === ЗАПУСК СЕРВЕРА ===
server.listen(PORT, () => {
  console.log(`🔧 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws/chat`);
});