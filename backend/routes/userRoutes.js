// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

// 회원가입 엔드포인트
router.post('/signup', userController.signupUser);

// 로그인 엔드포인트
router.post('/login', userController.loginUser);

// 닉네임 중복 체크 엔드포인트
//router.get('/check-nickname', userController.checkNicknameAvailability);

// 아이디 중복 체크 엔드포인트
//router.get('/check-id', userController.checkIdAvailability);
  

module.exports = router;
