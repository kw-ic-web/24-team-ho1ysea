// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
// const Report = require("../models/report");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const adminController = require("../controllers/adminController.js");


// 제재당한 유저 조회 엔드포인트
router.get("/banned_users", authMiddleware,adminMiddleware, adminController.getBannedUsers);

// // 전체 유저 데이터 조회 엔드포인트
router.get("/users", authMiddleware, adminMiddleware, adminController.allUsers);

// // 사용자 제재 엔드포인트
router.post("/ban", authMiddleware, adminMiddleware, adminController.banningUser);

// // 유저별 신고 횟수 전체 조회 엔드포인트
 router.get("/reports",authMiddleware,adminMiddleware, adminController.allReports);

// // 쓰레기 생성 속도 조절
// router.patch("/trash-speed", adminController.trashSpeed);

// // 생성 가능한 최대 쓰레기 양 조절
// router.patch("/trash-limit", adminController.trashLimit);

// // 관리자 판별
// router.get("/is-admin", adminController.isAdmin);

module.exports = router;