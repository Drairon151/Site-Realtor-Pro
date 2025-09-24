// server/controllers/authController.js

// Импортируем нужные модули
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // встроен в Node.js
const { sendVerificationEmail } = require('../utils/emailService');

// Подключаем .env
require('dotenv').config();

// Функция для генерации JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      mail: user.mail,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // токен живёт 7 дней
  );
};

// --- КОНТРОЛЛЕРЫ ---

// Регистрация
const register = async (req, res) => {
  console.log('\n🔧 === НАЧАЛО РЕГИСТРАЦИИ ===');
  console.log('📥 Получены данные:', req.body);

  const { userName, mail, numberPhone, password, role = 'client' } = req.body;

  if (!userName || !mail || !password) {
    console.log('❌ Ошибка: Не все обязательные поля заполнены');
    return res.status(400).json({
      message: 'Имя, email и пароль обязательны',
    });
  }

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      console.log(`❌ Пользователь с email ${mail} уже существует`);
      return res.status(400).json({
        message: 'Пользователь с такой почтой уже зарегистрирован',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Пароль захеширован');

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log('🔢 Код подтверждения:', verificationCode);

    const user = new User({
      userName,
      mail,
      numberPhone,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    await user.save();
    console.log('✅ Пользователь сохранён:', user._id);

    // 🚀 ГЕНЕРИРУЕМ ТОКЕН И УСТАНАВЛИВАЕМ КУКУ (как при входе)
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 📧 Отправляем письмо
    const emailSent = await sendVerificationEmail(mail, verificationCode);
    if (!emailSent) {
      console.log('⚠️ Не удалось отправить письмо');
    } else {
      console.log('✅ Письмо отправлено');
    }

    // 📦 ОТПРАВЛЯЕМ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
    res.status(201).json({
      message: 'Регистрация успешна. Проверьте почту для подтверждения.',
      user: {
        _id: user._id,
        userName: user.userName,
        mail: user.mail,
        role: user.role,
        isVerified: user.isVerified, // → false
      },
    });
  } catch (err) {
    console.error('💥 Ошибка при регистрации:', err.message);
    res.status(500).json({
      message: 'Ошибка сервера при регистрации',
      error: err.message,
    });
  }
};

// Вход
const login = async (req, res) => {
  console.log('\n🔑 === НАЧАЛО ВХОДА ===');
  console.log('📥 Получены данные:', req.body);

  const { mail, password } = req.body;

  if (!mail || !password) {
    console.log('❌ Ошибка: Email или пароль не указаны');
    return res.status(400).json({
      message: 'Email и пароль обязательны',
    });
  }

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(400).json({
        message: 'Неверный email или пароль',
      });
    }

    if (!user.isVerified) {
      console.log('⚠️ Email не подтверждён');
      return res.status(403).json({
        message: 'Подтвердите email, чтобы войти',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Пароль не совпадает');
      return res.status(400).json({
        message: 'Неверный email или пароль',
      });
    }

    // Генерируем токен
    const token = generateToken(user);
    console.log('✅ Вход успешен. Токен выдан.');

    // Устанавливаем куку
    res.cookie('token', token, {
      httpOnly: true,     // ❗ JS не может прочитать
      secure: process.env.NODE_ENV === 'production', // в продакшене — только HTTPS
      sameSite: 'lax',    // защита от CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    });

    // Отправляем пользователя (без токена!)
    res.json({
      user: {
        _id: user._id,
        userName: user.userName,
        mail: user.mail,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('💥 Ошибка при входе:', err.message);
    res.status(500).json({
      message: 'Ошибка сервера при входе',
      error: err.message,
    });
  }
};

// Подтверждение email по коду
const verifyEmail = async (req, res) => {
  console.log('\n📧 === ПОДТВЕРЖДЕНИЕ EMAIL ===');
  console.log('📥 Получен запрос:', req.body);

  const { userId, code } = req.body;

  if (!userId || !code) {
    console.log('❌ Не хватает данных: userId или code');
    return res.status(400).json({
      message: 'Требуются userId и код',
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({
        message: 'Пользователь не существует',
      });
    }

    if (user.isVerified) {
      console.log('✅ Email уже подтверждён');
      return res.status(200).json({
        message: 'Email уже подтверждён',
      });
    }

    if (user.verificationCode !== code) {
      console.log('❌ Неверный код');
      return res.status(400).json({
        message: 'Неверный код подтверждения',
      });
    }

    if (Date.now() > user.verificationCodeExpires) {
      console.log('⏰ Код истёк');
      return res.status(400).json({
        message: 'Код подтверждения истёк. Запросите новый.',
      });
    }

    // Подтверждаем email
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    console.log('✅ Email успешно подтверждён!');
    res.json({
      message: 'Email подтверждён. Теперь можно войти.',
    });
  } catch (err) {
    console.error('💥 Ошибка при подтверждении:', err.message);
    res.status(500).json({
      message: 'Ошибка сервера при подтверждении',
      error: err.message,
    });
  }
};

// Выход
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Выход выполнен' });
};

module.exports = {
  register,
  login,
  verifyEmail,
  logout, // ← не забудь экспортировать
};