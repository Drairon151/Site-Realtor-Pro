// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationCode);

router.post('/logout', authController.logout);

router.post('/change-password', authController.changePassword);
router.post('/send-password-reset-code', authController.sendPasswordResetCode);
router.post('/resend-password-reset-code', authController.resendPasswordResetCode);
module.exports = router;