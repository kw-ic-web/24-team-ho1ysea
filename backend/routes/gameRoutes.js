const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const gameController = require("../controllers/gameController");

// 이동 속도 조회
router.get("/speed/my", authMiddleware, gameController.getMySpeed);

module.exports = router;