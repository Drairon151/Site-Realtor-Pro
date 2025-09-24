// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Получаем токен из заголовка
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  const token = authHeader.split(' ')[1]; // после "Bearer"

  try {
    // 2. Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Добавляем данные пользователя в запрос
    req.user = decoded; // теперь можно использовать req.user.userId, req.user.role
    
    next(); // разрешаем доступ к маршруту
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Срок действия токена истёк' });
    }
    return res.status(403).json({ message: 'Неверный токен' });
  }
};

module.exports = authMiddleware;