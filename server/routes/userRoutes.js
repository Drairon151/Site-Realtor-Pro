// server/routes/userController.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/change-password', userController.changePassword);
router.post('/send-password-reset-code', userController.sendPasswordResetCode);
router.post('/resend-password-reset-code', userController.resendPasswordResetCode);
module.exports = router;