// routes/adminRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
// const Report = require("../models/report");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const adminController = require("../controllers/adminController.js");
const validateApiKey = require("../middlewares/validateApiKey.js");

// 제재당한 유저 조회 엔드포인트
router.get(
  "/banned-users",
  authMiddleware,
  adminMiddleware,
  adminController.getBannedUsers
);

// 제제 갱신 엔드포인트 (API 키 검증 미들웨어 추가)
router.post(
  "/update-banned-users",
  validateApiKey, // API 키 검증 미들웨어
  adminController.updateBannedUsers
);

// // 전체 유저 데이터 조회 엔드포인트
router.get("/users", authMiddleware, adminMiddleware, adminController.allUsers);

// // 사용자 제재 엔드포인트
router.post(
  "/ban",
  authMiddleware,
  adminMiddleware,
  adminController.banningUser
);

// // 유저별 신고 횟수 전체 조회 엔드포인트
router.get(
  "/reports",
  authMiddleware,
  adminMiddleware,
  adminController.allReports
);

// 쓰레기 생성 속도 조절
router.patch(
  "/trash-speed",
  authMiddleware,
  adminMiddleware,
  adminController.setTrashSpeed
);

// 쓰레기 생성 속도 Get 엔드포인트
router.get(
  "/trash-speed",
  authMiddleware,
  adminMiddleware,
  adminController.getTrashSpeed
);

// 생성 가능한 최대 쓰레기 양 조절
router.patch(
  "/trash-limit",
  authMiddleware,
  adminMiddleware,
  adminController.setTrashLimit
);

// 최대 쓰레기 양 Get 엔드포인트
router.get(
  "/trash-limit",
  authMiddleware,
  adminMiddleware,
  adminController.getTrashLimit
);

// // 관리자 판별
// router.get("/is-admin", adminController.isAdmin);

// 관리자 인증 상태 확인 (현성 요청)
router.get(
  "/validate",
  authMiddleware,
  adminMiddleware,
  adminController.validateAdmin
);

module.exports = router;
