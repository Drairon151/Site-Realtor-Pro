// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, mail: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// --- РЕГИСТРАЦИЯ ---
const register = async (req, res) => {
  console.log('\n🔧 === РЕГИСТРАЦИЯ ===');
  const { 
    fullName, 
    mail, 
    numberPhone, 
    password, 
    role = 'client' 
  } = req.body;

  if (!fullName.name || !fullName.surname || !mail || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Имя, фамилия, email и пароль обязательны'
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

    // Проверка роли
    if (!['client', 'realtor'].includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: 'Недопустимая роль'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      fullName: {
        name: fullName.name,
        surname: fullName.surname,
        patronymic: fullName.patronymic,
      },
      mail,
      numberPhone,
      password: hashedPassword,
      role,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: verificationExpires,
      resendAttempts: 0
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
      message: 'Регистрация успешна. Подтвердите email.',
      _id: user._id
    });
  } catch (err) {
    console.error('💥 Ошибка:', err.message);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

// --- ВХОД ---
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
        fullName: user.fullName,
        mail: user.mail,
        role: user.role,
        numberPhone: user.numberPhone
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

// --- ПОДТВЕРЖДЕНИЕ EMAIL ---
const verifyEmail = async (req, res) => {
  const { _id, code } = req.body;
  if (!_id || !code) {
    return res.status(400).json({ status: 'error', type:'error', message: 'Требуются _id и код' });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ status: 'error', type:'error', message: 'Пользователь не найден' });
    }

    if (user.isVerified) {
      return res.status(200).json({ status: 'error',type:'error', message: 'Email уже подтверждён' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ status: 'error', type:'invalid_code', message: 'Неверный код' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      await User.deleteOne({ _id: _id });
      if (global.verificationTimers?.[_id]) {
        clearTimeout(global.verificationTimers[_id]);
        delete global.verificationTimers[_id];
      }
      return res.status(400).json({ status: 'error',type:'code_expired', message: 'Код истёк. Зарегистрируйтесь снова.' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    user.resendAttempts = 0;
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

// --- ПОВТОРНАЯ ОТПРАВКА КОДА ---
const resendVerificationCode = async (req, res) => {
  console.log('\n🔄 === ПОВТОРНАЯ ОТПРАВКА КОДА ===');

  try {
    const { _id } = req.body;

    const user = await User.findById(_id);
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
    const attempts = user.resendAttempts || 0;

    // Геометрический кулдаун: 30 × 2^attempts, максимум 180 сек
    const baseDelay = 30;
    const calculatedDelay = baseDelay * Math.pow(2, attempts);
    const cooldownSeconds = Math.min(calculatedDelay, 180);

    const lastSent = user.lastVerificationSentAt ? new Date(user.lastVerificationSentAt) : null;
    if (lastSent && now - lastSent < cooldownSeconds * 1000) {
      const remaining = Math.ceil((lastSent.getTime() + cooldownSeconds * 1000 - now) / 1000);
      return res.status(400).json({
        status: 'error',
        cooldown: remaining,
        message: `Подождите ${remaining} секунд`,
        maxCooldownReached: cooldownSeconds >= 180
      });
    }

    // Генерируем новый код
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    user.lastVerificationSentAt = now;
    user.resendAttempts = attempts + 1;
    await user.save();

    // Отправляем письмо
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
      message: 'Код отправлен повторно',
      cooldown: cooldownSeconds
    });
  } catch (err) {
    console.error('💥 Ошибка:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

const changePassword = async (req, res) => {
  console.log('\n🔐 === СМЕНА ПАРОЛЯ ===');
  console.log('📥 Тело запроса:', req.body);

  const { code, oldPassword, newPassword } = req.body;
  const userId = req.body._id; // ✅ Берём из токена

  try {
    // 1. Найти пользователя (нужен для старого пароля и email)
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({ 
        status: 'error' ,
        type:'error', 
        message: 'Пользователь не найден' });
    }

    // 2. Получить запись о сбросе по userId
    const resetData = global.passwordResetStore?.[userId];
    if (!resetData) {
      console.log(`❌ Нет активной сессии сброса пароля для userId: ${userId}`);
      return res.status(400).json({
        status: 'error' ,
        type:'error', 
        message: 'Сначала запросите код'
      });
    }

    // 3. Проверка срока действия
    if (Date.now() > resetData.expiresAt) {
      console.log(`❌ Срок действия кода истёк для userId: ${userId}`);
      delete global.passwordResetStore[userId];
      return res.status(400).json({
        status: 'error' ,
        type:'code_expired', 
        message: 'Срок действия кода истёк. Запросите новый.'
      });
    }

    // 🔁 Режим 1: проверка кода
    if (code && !oldPassword && !newPassword) {
      console.log(`🔢 Проверка кода для userId: ${userId}. Ожидается: ${resetData.code}, введён: ${code}`);
      
      if (code !== resetData.code) {
        console.log('❌ Неверный код');
        return res.status(400).json({
          status: 'error',
          type: 'invalid_code',
          message: 'Неверный код'
        });
      }

      resetData.verified = true;
      console.log(`✅ Код подтверждён для userId: ${userId}`);

      return res.json({
        status: 'success',
        type: 'success',
        message: 'Код подтверждён. Введите старый и новый пароль.'
      });
    }

    // 🔁 Режим 2: смена пароля
    if (resetData.verified && oldPassword && newPassword) {
      console.log(`🔄 Попытка смены пароля для userId: ${userId}`);

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        console.log('❌ Старый пароль не совпадает');
        return res.status(400).json({
          status: 'error',
          message: 'Неверный текущий пароль'
        });
      }

      // Хэшируем и сохраняем новый пароль
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Удаляем запись после успеха
      delete global.passwordResetStore[userId];

      // Генерируем новый JWT
      const token = jwt.sign(
        { _id: user._id, mail: user.mail, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log(`✅ Пароль успешно изменён для userId: ${userId}. Выдан новый JWT.`);
      return res.json({
        status: 'success',
        message: 'Пароль успешно изменён'
      });
    }

    // Если ни один режим не подошёл
    console.log('⚠️ Недостаточно данных для обработки запроса');
    return res.status(400).json({
      status: 'error',
      message: 'Требуются код или старый/новый пароли'
    });
  } catch (err) {
    console.error('💥 Ошибка при смене пароля:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

const sendPasswordResetCode = async (req, res) => {
  console.log('\n📧 === ОТПРАВКА КОДА ДЛЯ СМЕНЫ ПАРОЛЯ ===');

  const userId = req.body._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        status: 'success',
        message: 'Если аккаунт существует — код отправлен'
      });
    }

    const resetCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!global.passwordResetStore) {
      global.passwordResetStore = {};
    }

    global.passwordResetStore[userId] = {
      code: resetCode,
      mail: user.mail, // сохраним email для отправки
      expiresAt,
      verified: false,
      attempts: 0,
      lastSent: new Date()
    };

    console.log(`🔑 Код сгенерирован для userId: ${userId}: ${resetCode}`);
    console.log(`📨 Отправка на email: ${user.mail}`);

    const emailSent = await sendVerificationEmail(user.mail, resetCode);
    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо');
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log(`✅ Код отправлен на ${user.mail}`);
    res.json({
      status: 'success',
      message: 'Код отправлен на ваш email'
    });
  } catch (err) {
    console.error('💥 Ошибка:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// server/controllers/authController.js
const resendPasswordResetCode = async (req, res) => {
  console.log('\n🔄 === ПОВТОРНАЯ ОТПРАВКА КОДА СМЕНЫ ПАРОЛЯ ===');
  console.log('📥 Повторная отправка для _id:', req.body._id);

  const { _id } = req.body;
  const user = await User.findById(_id);


  if (!_id) {
    console.log('❌ Ошибка: id не указан');
    return res.status(400).json({
      status: 'error',
      message: '_id обязателен'
    });
  }

  try {
    const resetData = global.passwordResetStore?.[_id];
    if (!resetData) {
      console.log(`❌ Нет активной сессии сброса пароля для ${_id}`);
      return res.status(400).json({
        status: 'error',
        message: 'Сначала запросите код'
      });
    }

    const now = new Date();
    const attempts = resetData.attempts || 0;
    const baseDelay = 30;
    const calculatedDelay = baseDelay * Math.pow(2, attempts);
    const cooldownSeconds = Math.min(calculatedDelay, 180);

    if (now - resetData.lastSent < cooldownSeconds * 1000) {
      const remaining = Math.ceil((resetData.lastSent.getTime() + cooldownSeconds * 1000 - now) / 1000);
      console.log(`⏳ Повторная отправка заблокирована. Осталось: ${remaining} сек`);
      return res.status(400).json({
        status: 'error',
        cooldown: remaining,
        message: `Подождите ${remaining} секунд`
      });
    }

    const newCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    resetData.code = newCode;
    resetData.expiresAt = expiresAt;
    resetData.lastSent = now;
    resetData.attempts = attempts + 1;
    resetData.verified = false;

    console.log(`🔑 Сгенерирован новый код: ${newCode} для ${_id}`);
    console.log(`🔄 Количество попыток: ${resetData.attempts}`);
    console.log(`⏳ Новый срок действия: до ${expiresAt}`);

    const emailSent = await sendVerificationEmail(user.mail, newCode);
    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо повторно');
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log(`✅ Новый код отправлен на ${user.mail}`);
    res.json({
      status: 'success',
      message: 'Код отправлен повторно',
      cooldown: cooldownSeconds
    });
  } catch (err) {
    console.error('💥 Ошибка при повторной отправке:', err.message);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// --- ВЫХОД ---
function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Выход выполнен' });
}


module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  logout,

  sendPasswordResetCode,
  changePassword,
  resendPasswordResetCode,
};