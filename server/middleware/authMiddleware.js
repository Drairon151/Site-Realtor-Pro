const User = require('../models/User')
// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  // console.log('\n🔐 === ПРОВЕРКА АВТОРИЗАЦИИ ===');

  // 1. Проверяем, есть ли куки вообще
  // console.log('🍪 req.cookies:', req.cookies);

  const token = req.cookies.token;

  if (!token) {
    console.log('❌ Токен не найден в куках');
    return res.status(401).json({
      status: 'error',
      type: 'no_token',
      message: 'Требуется авторизация'
    });
  }

  // console.log('✅ Токен найден:', token.substring(0, 20) + '...');
  // console.log('✅ Токен найден:');

  try {
    // 2. Проверяем и расшифровываем JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('✅ Токен валиден. Расшифрован:', decoded);

    const user = await User.findById(decoded._id).select('-password'); 
    if (!user) return res.status(401).json({ message: 'Пользователь не найден' });

    req.user = user;
    next(); // разрешаем доступ к маршруту
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('⏰ Токен просрочен');
      return res.status(401).json({
        status: 'error',
        type: 'token_expired',
        message: 'Срок действия токена истёк'
      });
    } else if (err.name === 'JsonWebTokenError') {
      console.log('❌ Неверный формат токена');
      return res.status(403).json({
        status: 'error',
        type: 'invalid_token',
        message: 'Неверный токен'
      });
    } else {
      console.error('💥 Ошибка проверки токена:', err.message);
      return res.status(403).json({
        status: 'error',
        type: 'server_error',
        message: 'Ошибка проверки токена'
      });
    }
  }
};

module.exports = authMiddleware;