// routes/coinRoutes.js
const express = require("express");
const router = express.Router();
const coinController = require("../controllers/coinController");
const authMiddleware = require("../middlewares/authMiddleware");

// 보유 재화 조회
router.get("/my", authMiddleware, coinController.getMyCoin);
router.get("/test", authMiddleware, coinController.testIncCoin);
module.exports = router;
