// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
require('dotenv').config();

// Генерация JWT
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, mail: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Регистрация
exports.register = async (req, res) => {
  const { userName, mail, numberPhone, password, role = 'client' } = req.body;

  try {
    // 1. Проверка: есть ли пользователь
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с такой почтой уже существует' });
    }

    // 2. Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Генерация 6-значного кода
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    // 4. Создание пользователя
    const user = new User({
      userName,
      mail,
      numberPhone,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires,
    });

    await user.save();

    // 5. Отправка письма
    const emailSent = await sendVerificationEmail(mail, verificationCode);

    if (!emailSent) {
      return res.status(500).json({ message: 'Не удалось отправить письмо' });
    }

    res.status(201).json({
      message: 'Пользователь создан. Проверьте почту для подтверждения.',
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера', error: err.message });
  }
};

// Подтверждение email кодом
exports.verifyEmail = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'Email уже подтверждён' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Неверный код' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ message: 'Код истёк' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email успешно подтверждён!' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Вход
exports.login = async (req, res) => {
  const { mail, password } = req.body;

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ message: 'Неверная почта или пароль' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверная почта или пароль' });
    }

    // Проверка подтверждения email
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Подтвердите email, чтобы войти' });
    }

    // Генерация токена
    const token = generateToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        mail: user.mail,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};