// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(`
      _id 
      name
      surname
      patronymic
      mail 
      role 
      numberPhone 
      isDiplomaVerified
    `);

    if (!user) {
      return res.status(403).json({ message: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;