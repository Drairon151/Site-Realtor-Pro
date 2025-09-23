// server/utils/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: '"Риелтор-Профи" <no-reply@rieltorprofi.ru>',
    to: email,
    subject: 'Код подтверждения регистрации',
    text: `Ваш код: ${code}`,
    html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Письмо отправлено:', info.messageId);
    return true;
  } catch (err) {
    console.error('Ошибка отправки письма:', err);
    return false;
  }
};

module.exports = { sendVerificationEmail };