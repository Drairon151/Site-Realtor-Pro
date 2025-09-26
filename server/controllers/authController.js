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
  console.log('\n🔧 === РЕГИСТРАЦИЯ ===');
  const { userName, mail, numberPhone, password, role = 'client' } = req.body;

  if (!userName || !mail || !password) {
    return res.status(400).json({
      status: 'error',
      type: 'missing_data',
      message: 'Имя, email и пароль обязательны'
    });
  }

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        type: 'user_exists',
        message: 'Пользователь с такой почтой уже существует'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

    const user = new User({
      userName,
      mail,
      numberPhone,
      password: hashedPassword,
      role,
      verificationCode,
      verificationCodeExpires: verificationExpires,
      isVerified: false,
    });

    await user.save();
    console.log('✅ Пользователь создан:', user._id);

    // 🕒 ЗАПУСКАЕМ ТАЙМЕР НА УДАЛЕНИЕ
    const cleanupTimer = setTimeout(async () => {
      try {
        const freshUser = await User.findById(user._id);
        if (freshUser && !freshUser.isVerified) {
          await User.deleteOne({ _id: user._id });
          console.log(`❌ Пользователь ${user.mail} удалён по таймауту`);
        }
      } catch (err) {
        console.error('Ошибка при удалении пользователя:', err);
      }
    }, 10 * 60 * 1000); // 10 минут

    // Сохраняем таймер в памяти сервера (или используй Redis в продакшене)
    // Для простоты — временно храним в глобальном объекте
    if (!global.verificationTimers) global.verificationTimers = {};
    global.verificationTimers[user._id] = cleanupTimer;

    // 📧 Отправляем письмо
    const emailSent = await sendVerificationEmail(mail, verificationCode);
    if (!emailSent) {
      console.log('⚠️ Не удалось отправить письмо');
    }

    // ✅ Возвращаем ответ
    res.status(201).json({
      status: 'success',
      message: 'Регистрация успешна. Подтвердите email.',
      userId: user._id,
    });
  } catch (err) {
    console.error('💥 Ошибка при регистрации:', err.message);
    res.status(500).json({
      status: 'error',
      type: 'server_error',
      message: 'Ошибка сервера'
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
  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({
      status: 'error',
      type: 'missing_data',
      message: 'Требуются userId и код'
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        type: 'not_found',
        message: 'Пользователь не найден'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        type: 'already_verified',
        message: 'Email уже подтверждён'
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        status: 'error',
        type: 'invalid_code',
        message: 'Неверный код'
      });
    }

    if (Date.now() > user.verificationCodeExpires) {
      // ❌ Код истёк → удаляем пользователя
      await User.deleteOne({ _id: userId });

      // Очищаем таймер, если он ещё работает
      if (global.verificationTimers?.[userId]) {
        clearTimeout(global.verificationTimers[userId]);
        delete global.verificationTimers[userId];
      }

      return res.status(400).json({
        status: 'error',
        type: 'expired',
        message: 'Срок действия кода истёк. Пожалуйста, зарегистрируйтесь снова.'
      });
    }

    // ✅ Успешное подтверждение
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // 🛑 Отменяем таймер
    if (global.verificationTimers?.[userId]) {
      clearTimeout(global.verificationTimers[userId]);
      delete global.verificationTimers[userId];
    }

    res.status(200).json({
      status: 'success',
      type: 'verified',
      message: 'Email успешно подтверждён!',
      user: {
        _id: user._id,
        userName: user.userName,
        mail: user.mail,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      type: 'server_error',
      message: 'Ошибка сервера'
    });
  }
};

const resendVerificationCode = async (req, res) => {
  console.log('\n🔄 === ПОВТОРНАЯ ОТПРАВКА КОДА ===');
  const { userId } = req.body;

  if (!userId) {
    console.log('❌ Ошибка: userId не указан');
    return res.status(400).json({
      status: 'error',
      type: 'missing_data',
      message: 'Требуется userId'
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({
        status: 'error',
        type: 'not_found',
        message: 'Пользователь не существует'
      });
    }

    if (user.isVerified) {
      console.log('✅ Email уже подтверждён');
      return res.status(200).json({
        status: 'success',
        type: 'already_verified',
        message: 'Email уже подтверждён'
      });
    }

    // ⏱️ Проверка: прошло ли 60 секунд с последней отправки?
    const now = new Date();
    const MINUTES_1 = 60 * 1000;
    if (user.verificationCodeExpires && now < user.verificationCodeExpires) {
      const remainingSeconds = Math.ceil((user.verificationCodeExpires - now) / 1000);
      console.log(`⏰ Код ещё действует. Осталось ${remainingSeconds} сек.`);
      return res.status(400).json({
        status: 'error',
        type: 'cooldown',
        message: `Подождите ${remainingSeconds} секунд`,
        cooldown: remainingSeconds
      });
    }

    // 🔄 Генерируем новый код
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // +10 минут

    // Сохраняем в базу
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // 📧 Отправляем письмо
    const emailSent = await sendVerificationEmail(user.mail, verificationCode);

    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо');
      return res.status(500).json({
        status: 'error',
        type: 'email_failed',
        message: 'Не удалось отправить письмо. Попробуйте позже.'
      });
    }

    console.log('✅ Новый код отправлен на', user.mail);
    res.status(200).json({
      status: 'success',
      type: 'resend_success',
      message: 'Код отправлен повторно'
    });
  } catch (err) {
    console.error('💥 Ошибка при повторной отправке:', err.message);
    res.status(500).json({
      status: 'error',
      type: 'server_error',
      message: 'Ошибка сервера'
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
  logout,
  resendVerificationCode,
};
