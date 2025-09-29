// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, mail: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// --- Контроллеры ---
const register = async (req, res) => {
  console.log('\n🔧 === РЕГИСТРАЦИЯ ===');
  const { userName, mail, numberPhone, password, role = 'client' } = req.body;

  if (!userName || !mail || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Имя, email и пароль обязательны'
    });
  }

  try {
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Пользователь с такой почтой уже существует'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

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

    // 🕒 Таймер удаления
    const cleanupTimer = setTimeout(async () => {
      try {
        const freshUser = await User.findById(user._id);
        if (freshUser && !freshUser.isVerified) {
          await User.deleteOne({ _id: user._id });
          console.log(`❌ Пользователь ${user.mail} удалён`);
        }
      } catch (err) {
        console.error('Ошибка при удалении:', err);
      }
    }, 10 * 60 * 1000);

    if (!global.verificationTimers) global.verificationTimers = {};
    global.verificationTimers[user._id] = cleanupTimer;

    const emailSent = await sendVerificationEmail(mail, verificationCode);
    if (!emailSent) {
      console.log('⚠️ Не удалось отправить письмо');
    }

    res.status(201).json({
      status: 'success',
      message: 'Регистрация успешна. Подтвердите email.'
    });
  } catch (err) {
    console.error('💥 Ошибка:', err.message);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

const login = async (req, res) => {
  const { mail, password } = req.body;
  if (!mail || !password) {
    return res.status(400).json({ status: 'error', message: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Неверный email или пароль' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ status: 'error', message: 'Подтвердите email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Неверный email или пароль' });
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 'success',
      user: {
        _id: user._id,
        userName: user.userName,
        mail: user.mail,
        role: user.role,
        numberPhone: user.numberPhone
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

const verifyEmail = async (req, res) => {
  const { userId, code } = req.body;
  if (!userId || !code) {
    return res.status(400).json({ status: 'error', message: 'Требуются userId и код' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    if (user.isVerified) {
      return res.status(200).json({ status: 'success', message: 'Email уже подтверждён' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ status: 'error', message: 'Неверный код' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      await User.deleteOne({ _id: userId });
      if (global.verificationTimers?.[userId]) {
        clearTimeout(global.verificationTimers[userId]);
        delete global.verificationTimers[userId];
      }
      return res.status(400).json({ status: 'error', message: 'Код истёк. Зарегистрируйтесь снова.' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 'success',
      message: 'Email успешно подтверждён!'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

const resendVerificationCode = async (req, res) => {
  console.log('\n🔄 === ПОВТОРНАЯ ОТПРАВКА КОДА ===');

  try {
    // ✅ userId берём из токена, а не из тела
    const { userId } = req.user; // ← установлен authMiddleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        status: 'success',
        message: 'Email уже подтверждён'
      });
    }

    const now = new Date();
    const MINUTES_1 = 60 * 1000;

    // 🔁 Проверка: прошло ли 60 секунд?
    if (user.verificationCodeExpires && now < user.verificationCodeExpires) {
      const remainingSeconds = Math.ceil((user.verificationCodeExpires - now) / 1000);
      return res.status(400).json({
        status: 'error',
        message: `Подождите ${remainingSeconds} секунд`,
        cooldown: remainingSeconds
      });
    }

    // 🔄 Генерируем новый код
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // 📧 Отправляем письмо
    const emailSent = await sendVerificationEmail(user.mail, verificationCode);
    if (!emailSent) {
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log('✅ Новый код отправлен на', user.mail);
    res.json({
      status: 'success',
      message: 'Код отправлен повторно'
    });
  } catch (err) {
    console.error('💥 Ошибка при повторной отправке:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Выход выполнен' });
}

// ✅ Экспорт — только в конце
module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  logout,
};