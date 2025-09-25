// server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (email, code) => {
  // Создаём транспортер для Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Удобный способ — Nodemailer сам знает настройки Gmail
    auth: {
      user: process.env.EMAIL_USER, // например: rieltorprofi.dev@gmail.com
      pass: process.env.EMAIL_PASS, // твой 16-символьный App Password
    },
  });

  // Определяем письмо
  const mailOptions = {
    from: `"Риелтор-Профи" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Код подтверждения регистрации',
    text: `Ваш код подтверждения: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Добро пожаловать в «Риелтор-Профи»!</h2>
        <p>Спасибо за регистрацию. Чтобы завершить регистрацию, введите код ниже:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0056b3;">${code}</span>
        </div>
        <p>Этот код действует 10 минут.</p>
        <p>Если вы не регистрировались у нас — просто проигнорируйте это письмо.</p>
        <hr style="border: 1px solid #eee;" />
        <p style="color: #777; font-size: 12px;">© 2025 Риелтор-Профи. Все права защищены.</p>
      </div>
    `,
  };

  try {
    // Отправляем письмо
    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Письмо успешно отправлено на:', email);
    return true;
  } catch (err) {
    console.error('❌ Ошибка отправки письма:', err.message);
    console.error('Полная ошибка:', err); // Для детальной отладки
    return false;
  }
};

module.exports = { sendVerificationEmail };