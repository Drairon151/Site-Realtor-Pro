const express = require('express');
const router = express.Router();
const messagerController = require('../controllers/messagerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/getChatsInfo', authMiddleware, messagerController.getChatsInfo);
router.get('/getChatData', authMiddleware, messagerController.getChatData);
router.post('/createNewChat', authMiddleware, messagerController.createNewChat);

module.exports = router;