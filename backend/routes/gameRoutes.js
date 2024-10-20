const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const gameController = require("../controllers/gameController");

// 이동 속도 조회
router.get("/speed/my", authMiddleware, gameController.getMySpeed);

// 이동 속도 증가
router.patch("/speed/my/up", authMiddleware, gameController.increaseMySpeed);

// 사거리 조회
router.get("/range/my", authMiddleware, gameController.getMyRange);


module.exports = router;