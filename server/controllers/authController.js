// server/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
require('dotenv').config();

const generateToken = (user) => {
  console.log('🔐 Генерация JWT токена для пользователя:', user._id);
  return jwt.sign(
    { _id: user._id, mail: user.mail, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// --- РЕГИСТРАЦИЯ ---
const register = async (req, res) => {
  console.log('\n\n🟢🟢🟢 === НАЧАЛО РЕГИСТРАЦИИ ===');
  console.log('📥 Полученные данные:', req.body);

  const { 
    name, 
    surname, 
    patronymic, 
    mail, 
    numberPhone, 
    password, 
    role = 'client' 
  } = req.body;

  if (!name || !surname || !patronymic || !mail || !password) {
    console.log('❌ Ошибка валидации: отсутствуют обязательные поля');
    return res.status(400).json({
      status: 'error',
      message: 'Имя, фамилия, отчество, email и пароль обязательны'
    });
  }

  try {
    console.log('🔍 Проверка существования пользователя с email:', mail);
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      console.log('❌ Пользователь с таким email уже существует:', mail);
      return res.status(400).json({
        status: 'error',
        message: 'Пользователь с такой почтой уже существует'
      });
    }

    if (!['client', 'realtor'].includes(role)) {
      console.log('❌ Недопустимая роль:', role);
      return res.status(400).json({
        status: 'error',
        message: 'Недопустимая роль'
      });
    }

    console.log('🔒 Хеширование пароля...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000);

    console.log('🆕 Создание нового пользователя в БД...');
    const user = new User({
      name,
      surname,
      patronymic,
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
    console.log('✅ Пользователь успешно сохранён в БД:', {
      _id: user._id,
      name: user.name,
      surname: user.surname,
      patronymic: user.patronymic,
      mail: user.mail,
      role: user.role
    });

    // 🕒 Таймер удаления
    const cleanupTimer = setTimeout(async () => {
      try {
        const freshUser = await User.findById(user._id);
        if (freshUser && !freshUser.isVerified) {
          await User.deleteOne({ _id: user._id });
          console.log(`🗑️ Автоматическое удаление не подтверждённого пользователя: ${user.mail}`);
        }
      } catch (err) {
        console.error('💥 Ошибка при автоматическом удалении:', err);
      }
    }, 10 * 60 * 1000);

    if (!global.verificationTimers) global.verificationTimers = {};
    global.verificationTimers[user._id] = cleanupTimer;

    console.log('📧 Отправка кода подтверждения на email:', mail);
    const emailSent = await sendVerificationEmail(mail, verificationCode);
    if (!emailSent) {
      console.log('⚠️ Не удалось отправить письмо на', mail);
    } else {
      console.log('✅ Письмо с кодом успешно отправлено');
    }

    res.status(201).json({
      status: 'success',
      message: 'Регистрация успешна. Подтвердите email.',
      _id: user._id
    });

    console.log('🟢🟢🟢 === РЕГИСТРАЦИЯ ЗАВЕРШЕНА ===\n\n');
  } catch (err) {
    console.error('💥 КРИТИЧЕСКАЯ ОШИБКА при регистрации:', err);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

// --- ВХОД ---
const login = async (req, res) => {
  console.log('\n\n🔵🔵🔵 === НАЧАЛО ВХОДА ===');
  console.log('📥 Данные входа:', req.body);

  const { mail, password } = req.body;
  if (!mail || !password) {
    console.log('❌ Отсутствуют email или пароль');
    return res.status(400).json({ status: 'error', message: 'Email и пароль обязательны' });
  }

  try {
    console.log('🔍 Поиск пользователя по email:', mail);
    const user = await User.findOne({ mail });
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(400).json({ status: 'error', message: 'Неверный email или пароль' });
    }

    if (!user.isVerified) {
      console.log('❌ Попытка входа без подтверждения email:', mail);
      return res.status(403).json({ status: 'error', message: 'Подтвердите email' });
    }

    console.log('🔄 Проверка пароля для пользователя:', user._id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Неверный пароль для:', mail);
      return res.status(400).json({ status: 'error', message: 'Неверный email или пароль' });
    }

    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log('✅ Успешный вход. Отправка данных пользователя...');
    res.json({
      status: 'success',
      user: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        patronymic: user.patronymic,
        mail: user.mail,
        role: user.role,
        numberPhone: user.numberPhone
      }
    });

    console.log('🔵🔵🔵 === ВХОД ЗАВЕРШЁН ===\n\n');
  } catch (err) {
    console.error('💥 Ошибка при входе:', err);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

// --- ПОДТВЕРЖДЕНИЕ EMAIL ---
const verifyEmail = async (req, res) => {
  console.log('\n\n🟡🟡🟡 === ПОДТВЕРЖДЕНИЕ EMAIL ===');
  console.log('📥 Данные подтверждения:', req.body);

  const { _id, code } = req.body;
  if (!_id || !code) {
    console.log('❌ Отсутствует _id или код подтверждения');
    return res.status(400).json({ status: 'error', type:'error', message: 'Требуются _id и код' });
  }

  try {
    console.log('🔍 Поиск пользователя по _id:', _id);
    const user = await User.findById(_id);
    if (!user) {
      console.log('❌ Пользователь не найден по _id:', _id);
      return res.status(404).json({ status: 'error', type:'error', message: 'Пользователь не найден' });
    }

    if (user.isVerified) {
      console.log('ℹ️ Email уже подтверждён:', user.mail);
      return res.status(200).json({ status: 'error',type:'error', message: 'Email уже подтверждён' });
    }

    if (user.verificationCode !== code) {
      console.log('❌ Неверный код. Ожидалось:', user.verificationCode, 'Получено:', code);
      return res.status(400).json({ status: 'error', type:'invalid_code', message: 'Неверный код' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      console.log('⏳ Код истёк. Удаление пользователя:', user.mail);
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

    console.log('✅ Email подтверждён для пользователя:', user.mail);

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

    console.log('🟡🟡🟡 === ПОДТВЕРЖДЕНИЕ EMAIL ЗАВЕРШЕНО ===\n\n');
  } catch (err) {
    console.error('💥 Ошибка при подтверждении email:', err);
    res.status(500).json({ status: 'error', message: 'Ошибка сервера' });
  }
};

// --- ПОВТОРНАЯ ОТПРАВКА КОДА ---
const resendVerificationCode = async (req, res) => {
  console.log('\n\n🔄🔄🔄 === ПОВТОРНАЯ ОТПРАВКА КОДА ПОДТВЕРЖДЕНИЯ ===');
  console.log('📥 Запрос на повторную отправку:', req.body);

  try {
    const { _id } = req.body;

    console.log('🔍 Поиск пользователя по _id:', _id);
    const user = await User.findById(_id);
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }

    if (user.isVerified) {
      console.log('ℹ️ Попытка повторной отправки для уже подтверждённого email:', user.mail);
      return res.status(200).json({
        status: 'success',
        message: 'Email уже подтверждён'
      });
    }

    const now = new Date();
    const attempts = user.resendAttempts || 0;
    const baseDelay = 30;
    const calculatedDelay = baseDelay * Math.pow(2, attempts);
    const cooldownSeconds = Math.min(calculatedDelay, 180);

    const lastSent = user.lastVerificationSentAt ? new Date(user.lastVerificationSentAt) : null;
    if (lastSent && now - lastSent < cooldownSeconds * 1000) {
      const remaining = Math.ceil((lastSent.getTime() + cooldownSeconds * 1000 - now) / 1000);
      console.log(`⏳ Кулдаун активен. Осталось ${remaining} секунд`);
      return res.status(400).json({
        status: 'error',
        cooldown: remaining,
        message: `Подождите ${remaining} секунд`,
        maxCooldownReached: cooldownSeconds >= 180
      });
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    user.lastVerificationSentAt = now;
    user.resendAttempts = attempts + 1;
    await user.save();

    console.log('📧 Отправка нового кода на:', user.mail, 'Код:', verificationCode);
    const emailSent = await sendVerificationEmail(user.mail, verificationCode);
    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо');
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log('✅ Новый код подтверждения отправлен');
    res.json({
      status: 'success',
      message: 'Код отправлен повторно',
      cooldown: cooldownSeconds
    });

    console.log('🔄🔄🔄 === ПОВТОРНАЯ ОТПРАВКА ЗАВЕРШЕНА ===\n\n');
  } catch (err) {
    console.error('💥 Ошибка при повторной отправке кода:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};


// --- ВЫХОД ---
function logout(req, res) {
  console.log('\n\n🚪 === ВЫХОД ИЗ АККАУНТА ===');
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  console.log('🍪 Токен удалён. Выход выполнен.');
  res.json({ message: 'Выход выполнен' });
  console.log('🚪 === ВЫХОД ЗАВЕРШЁН ===\n\n');
}

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  logout,
};