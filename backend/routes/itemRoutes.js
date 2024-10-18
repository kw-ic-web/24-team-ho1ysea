
const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");

// 보유 아이템 조회 엔드포인트
router.get("/inventorys", authMiddleware, itemController.getUserInventory);

// 모든 아이템 설명 조회 엔드포인트
router.get("/descriptions", itemController.getAllItemDescriptions);

// 아이템 사용 엔드포인트
router.post("/use", authMiddleware, itemController.useItem);

// 아이템 습득 엔드포인트
router.post("/get", authMiddleware, itemController.addItem);


module.exports = router;
