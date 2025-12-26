const upload = require('../middleware/uploadMiddleware'); // ← новый middleware

// server/routes/userController.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/change-password', userController.changePassword);
router.post('/send-password-reset-code', userController.sendPasswordResetCode);
router.post('/resend-password-reset-code', userController.resendPasswordResetCode);
router.post('/update-user-field', userController.updateUserField);
router.post(
    '/change-user-photo', 
    authMiddleware,
    upload.array('avatar', 1),
    userController.changeUserPhoto,
);

module.exports = router;