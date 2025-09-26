// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/logout', authController.logout);
router.post('/resend-verification', authController.resendVerificationCode); // ← добавь эту строку

module.exports = router;