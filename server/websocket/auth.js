// server/websocket/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const cookie = require('cookie');

const authorizeWebSocket = async (request) => {
  console.log('[WS AUTH] === Начало авторизации WebSocket ===');
  
  try {
    const cookiesHeader = request.headers.cookie || '';
    console.log('[WS AUTH] Заголовок cookie:', cookiesHeader);

    const cookies = cookie.parse(cookiesHeader);
    const token = cookies.token;

    if (!token) {
      console.warn('[WS AUTH] ❌ Токен не найден в куках');
      return null;
    }

    console.log('[WS AUTH] ✅ Токен получен. Проверка валидности...');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[WS AUTH] Токен расшифрован. User ID:', decoded._id);

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      console.warn(`[WS AUTH] ❌ Пользователь не найден в БД: ${decoded._id}`);
      return null;
    }

    console.log(`[WS AUTH] ✅ Успешная авторизация: ${user.name} ${user.surname} (${user._id})`);
    return user._id.toString();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.warn('[WS AUTH] ❌ Токен просрочен');
    } else if (err.name === 'JsonWebTokenError') {
      console.warn('[WS AUTH] ❌ Неверный формат токена');
    } else {
      console.error('[WS AUTH] 💥 Неизвестная ошибка:', err.message);
    }
    return null;
  }
};

module.exports = { authorizeWebSocket };