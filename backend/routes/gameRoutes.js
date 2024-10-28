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

// 사거리 증가
router.patch("/range/my/up", authMiddleware, gameController.increaseMyRange);

// 이동 속도 및 사거리 초기화
router.patch("/reset", authMiddleware, gameController.resetSpeedAndRange);

// // 사망 처리
// router.patch("/death", authMiddleware, gameController.handleDeath);

// // 생존 여부 조회
// router.get("/is-alive", authMiddleware, gameController.checkIsAlive);

module.exports = router;