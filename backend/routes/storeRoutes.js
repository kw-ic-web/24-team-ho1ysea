// routes/storeRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = require("../controllers/userController");
const storeController = require("../controllers/storeController");
const authMiddleware = require("../middlewares/authMiddleware");

// 쓰레기 환전 엔드포인트
router.post("/exchange", authMiddleware, storeController.exchangeTrash);

// 상점 아이템 엔드포인트
router.get("/items", storeController.getStoreItems);

// 아이템 구매 엔드포인트
router.post("/buy", authMiddleware, storeController.buyItem);

// 아이템 판매 엔드포인트
router.post("/sell", authMiddleware, storeController.sellItem);

module.exports = router;
