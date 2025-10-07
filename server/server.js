// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // ← добавь
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes'); // ✅ Здесь!
const userRoutes = require('./routes/userRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // твой фронтенд
  credentials: true, // ← важно для кук
}));
app.use(express.json());
app.use(cookieParser()); // ← парсинг кук

app.use('/api/auth', authRoutes);
app.use('/api/user',userRoutes)
app.use('/api', profileRoutes);

app.get('/', (req, res) => {
  res.send('🚀 Сервер Риелтор-Профи запущен!');
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.log('❌ DB error:', err));

app.listen(PORT, () => {
  console.log(`🔧 Server running on http://localhost:${PORT}`);
});