const express = require('express');
const User = require('../models/User');
const router = express.Router();

// --- СМЕНА ПАРОЛЯ ---
const changePassword = async (req, res) => {
  console.log('\n\n🔑🔑🔑 === СМЕНА ПАРОЛЯ ===');
  console.log('📥 Тело запроса:', req.body);

  const { code, oldPassword, newPassword } = req.body;
  const userId = req.body._id;

  try {
    console.log('🔍 Поиск пользователя по _id:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ Пользователь не найден');
      return res.status(404).json({ 
        status: 'code-not-success',
        type:'error', 
        message: 'Пользователь не найден' });
    }

    const resetData = global.passwordResetStore?.[userId];
    if (!resetData) {
      console.log('❌ Нет активной сессии сброса пароля для:', userId);
      return res.status(400).json({
        status: 'code-not-success',
        type:'error', 
        message: 'Сначала запросите код'
      });
    }

    if (Date.now() > resetData.expiresAt) {
      console.log('⏳ Срок действия кода истёк. Удаление сессии для:', userId);
      delete global.passwordResetStore[userId];
      return res.status(400).json({
        status: 'code-not-success',
        type:'code_expired', 
        message: 'Срок действия кода истёк. Запросите новый.'
      });
    }

    // 🔁 Режим 1: проверка кода
    if (code && !oldPassword && !newPassword) {
      console.log(`🔢 Проверка кода: ожидается ${resetData.code}, получено ${code}`);
      if (code !== resetData.code) {
        console.log('❌ Неверный код подтверждения');
        return res.status(400).json({
          status: 'code-not-success',
          type: 'invalid_code',
          message: 'Неверный код'
        });
      }
      resetData.verified = true;
      console.log('✅ Код подтверждён. Ожидание ввода паролей.');
      return res.json({
        status: 'success',
        type: 'success',
        message: 'Код подтверждён. Введите старый и новый пароль.'
      });
    }

    // 🔁 Режим 2: смена пароля
    if (resetData.verified && oldPassword && newPassword) {
      console.log('🔄 Проверка старого пароля...');
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        console.log('❌ Старый пароль не совпадает');
        return res.status(400).json({
          status: 'code-not-success',
          message: 'Неверный текущий пароль'
        });
      }

      console.log('🔒 Хеширование нового пароля...');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      delete global.passwordResetStore[userId];

      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log('✅ Пароль успешно изменён. Выдан новый токен.');
      return res.json({
        status: 'success',
        message: 'Пароль успешно изменён'
      });
    }

    console.log('⚠️ Недостаточно данных для обработки запроса');
    return res.status(400).json({
      status: 'error',
      message: 'Требуются код или старый/новый пароли'
    });
  } catch (err) {
    console.error('💥 Ошибка при смене пароля:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// --- ОТПРАВКА КОДА ДЛЯ СМЕНЫ ПАРОЛЯ ---
const sendPasswordResetCode = async (req, res) => {
  console.log('\n\n✉️✉️✉️ === ОТПРАВКА КОДА СМЕНЫ ПАРОЛЯ ===');
  console.log('📥 Запрос:', req.body);

  const userId = req.body._id;

  try {
    console.log('🔍 Поиск пользователя по _id:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('ℹ️ Пользователь не найден — скрываем факт (безопасность)');
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
      mail: user.mail,
      expiresAt,
      verified: false,
      attempts: 0,
      lastSent: new Date()
    };

    console.log(`🔑 Код сгенерирован для ${userId}: ${resetCode} (истекает ${expiresAt})`);
    console.log(`📧 Отправка на: ${user.mail}`);

    const emailSent = await sendVerificationEmail(user.mail, resetCode);
    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо');
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log('✅ Код смены пароля отправлен');
    res.json({
      status: 'success',
      message: 'Код отправлен на ваш email'
    });

    console.log('✉️✉️✉️ === ОТПРАВКА КОДА ЗАВЕРШЕНА ===\n\n');
  } catch (err) {
    console.error('💥 Ошибка при отправке кода смены пароля:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

// --- ПОВТОРНАЯ ОТПРАВКА КОДА СМЕНЫ ПАРОЛЯ ---
const resendPasswordResetCode = async (req, res) => {
  console.log('\n\n🔁🔁🔁 === ПОВТОРНАЯ ОТПРАВКА КОДА СМЕНЫ ПАРОЛЯ ===');
  console.log('📥 Запрос:', req.body);

  const { _id } = req.body;

  if (!_id) {
    console.log('❌ _id не указан');
    return res.status(400).json({
      status: 'error',
      message: '_id обязателен'
    });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      console.log('❌ Пользователь не найден по _id:', _id);
      return res.status(404).json({
        status: 'error',
        message: 'Пользователь не найден'
      });
    }

    const resetData = global.passwordResetStore?.[_id];
    if (!resetData) {
      console.log('❌ Нет активной сессии сброса пароля для:', _id);
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
      console.log(`⏳ Кулдаун: осталось ${remaining} сек`);
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

    console.log(`🔑 Новый код: ${newCode} для ${_id}. Попытка №${resetData.attempts}`);

    const emailSent = await sendVerificationEmail(user.mail, newCode);
    if (!emailSent) {
      console.log('❌ Не удалось отправить письмо повторно');
      return res.status(500).json({
        status: 'error',
        message: 'Не удалось отправить письмо'
      });
    }

    console.log('✅ Повторная отправка кода смены пароля успешна');
    res.json({
      status: 'success',
      message: 'Код отправлен повторно',
      cooldown: cooldownSeconds
    });

    console.log('🔁🔁🔁 === ПОВТОРНАЯ ОТПРАВКА ЗАВЕРШЕНА ===\n\n');
  } catch (err) {
    console.error('💥 Ошибка при повторной отправке кода смены пароля:', err);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка сервера'
    });
  }
};

const updateUserField = async (req, res) => {
  console.log('Начало изменений данных пользователя')
  try{
    const {updatedField, updatedValue } = req.body;

    const userId = req.user._id;

    const allowedUpdates = ['name', 'surname', 'patronymic', 'mail', 'numberPhone', 'role'];

    if(!userId){
        return res.status(400).json({
            status:'error',
            message: 'Пользователь с таким айди не найден'
        })
    }

    if (!allowedUpdates.includes(updatedField)) {
      return res.status(400).json({
        status: 'error',
        message: 'Обновление этого поля запрещено'
      });
    }
    const update = {[updatedField]:updatedValue}
    console.log('Новые данные ', update)

    const user = await User.findByIdAndUpdate(
      userId,
      update,
      {
        new: true,
        runValidators: true
      }
    );

    if(!user){
      return res.status(400).json({
        status: 'error',
        message: 'Пользователь не найден'
      })
    }

      console.log('Изменения сохранены')
      res.json({
        status: 'success',
        updatedField,
        updatedValue: user[updatedField]
      }
    
    );

  } catch (error) {
      // 🚫 Ошибка уникальности (например, email уже занят)
      if (error.code === 11000) {
        return res.status(400).json({
          status: 'error',
          message: 'Этот email уже используется другим аккаунтом'
        });
      }

      // 🚫 Ошибки валидации Mongoose (required, формат и т.д.)
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message);
        return res.status(400).json({
          status: 'error',
          message: messages.join('; ')
        });
      }

      console.error('💥 Ошибка обновления профиля:', error);
      res.status(500).json({
        status: 'error',
        message: 'Внутренняя ошибка сервера'
      });
    }

};


module.exports = {
    sendPasswordResetCode,
    changePassword,
    resendPasswordResetCode,

    updateUserField,
}