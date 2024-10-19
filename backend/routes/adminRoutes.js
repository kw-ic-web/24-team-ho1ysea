// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
// const Report = require("../models/report");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController.js");


// 제재당한 유저 조회 엔드포인트
router.get("/banned_users", authMiddleware, adminController.getBannedUsers);

// // 전체 유저 데이터 조회 엔드포인트
// router.post("/users", adminController.allUsers);

// // 사용자 제재 엔드포인트
// router.post("/ban", adminController.ban);

// // 유저별 신고 횟수 전체 조회 엔드포인트
// router.post("/reports", adminController.reports);

// // 쓰레기 생성 속도 조절
// router.post("/trash-speed", adminController.trashSpeed);

// // 생성 가능한 최대 쓰레기 양 조절
// router.post("/trash-limit", adminController.trashLimit);

// // 관리자 판별
// router.post("/is-admin", adminController.isAdmin);

module.exports = router;