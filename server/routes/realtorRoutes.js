// server/routes/realtorRoutes.js
const express = require('express');
const router = express.Router();
const realtorController = require('../controllers/realtorController');
const authMiddleware = require('../middleware/authMiddleware');

// Все эндпоинты требуют авторизации
router.use(authMiddleware);

router.get('/getRealtorData', realtorController.getRealtorData);
router.post('/changeRealtorData', realtorController.changeRealtorData);
router.get('/all', realtorController.getRealtors)

module.exports = router;