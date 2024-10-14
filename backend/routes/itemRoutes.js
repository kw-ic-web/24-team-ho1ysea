// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어
const itemController = require('../controllers/itemController'); // 아이템 컨트롤러

// 보유 아이템 조회 엔드포인트
router.get('/inventorys', authMiddleware, itemController.getUserInventory); 

module.exports = router;
