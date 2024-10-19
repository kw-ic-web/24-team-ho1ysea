// controllers/adminController.js

const mongoose = require("mongoose");
require("dotenv").config(); // 환경 변수를 로드
const bcrypt = require("bcryptjs");
// const User = require("../models/User");
// const Report = require("../models/report");
const Ban = require("../models/ban")

// 제제당한 유저 조회 로직
exports.getBannedUsers = async (req, res) => {
    try {
      // Ban 테이블에서 모든 제재 정보를 가져오기
      const bannedUsers = await Ban.find().populate('userId'); 
  
      // 응답 포맷에 맞춰 데이터 가공
      const response = bannedUsers.map(ban => ({
        userId: ban.userId._id,
        nickName: ban.userId.nickName,
        freedomAt: ban.freedomAt // 이거 default 줘야 할지 고민이다
      }));
  
      return res.json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류입니다.' });
    }
  };

// // 전체유저 데이터 조회 로직
// exports.allUsers = async (req, res) => {};

// // 사용자 제제 로직
// exports.banningUser = async (req, res) => {};

// // 전체 유저 신고 수 조회
// exports.reports = async (req, res) => {};

// // 쓰레기 생성 속도 조절
// exports.trashSpeed = async (req, res) => {};

// // 생성 가능한 최대 쓰레기 양 조절
// exports.trashLimit = async (req, res) => {};

// // 어드민 판별
// exports.isAdmin = async (req, res) => {};
