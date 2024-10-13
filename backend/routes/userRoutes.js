// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// 회원가입 엔드포인트
router.post('/signup', userController.signupUser);

// 로그인 엔드포인트
router.post('/login', userController.loginUser);

// 닉네임 중복 체크 엔드포인트
router.get('/check-nickname', userController.checkNicknameAvailability);

// 아이디 중복 체크 엔드포인트
// router.get('/check-id', userController.checkIdAvailability);

// 유저 정보 조회 엔드포인트(토큰 필요)
router.get('/me', authMiddleware, userController.getUserInfo);

// 유저 정보 수정 엔드포인트 
router.patch('/me', authMiddleware, userController.updateUserInfo);

module.exports = router;
