// controllers/adminController.js
const { redisClient, subscriber } = require("../config/db");
const mongoose = require("mongoose");
require("dotenv").config(); // 환경 변수를 로드
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Report = require("../models/report");
const Ban = require("../models/ban")
const jwt = require("jsonwebtoken");

// 제제당한 유저 조회 로직
exports.getBannedUsers = async (req, res) => {
    try {
      // Ban 테이블에서 모든 제재 정보를 가져오기
      const bannedUsers = await Ban.find().populate('userId'); 
  
      // 응답 포맷에 맞춰 데이터 가공
      const response = bannedUsers.map(ban => ({
        userId: ban.userId,
        nickName: ban.nickName,
        freedomAt: ban.freedomAt // 이거 default 줘야 할지 고민이다
      }));
  
      return res.status(200).json(response);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류입니다.' });
    }
  };

// // 전체유저 데이터 조회 로직
exports.allUsers = async (req, res) => {
  try {
      // User 테이블에서 모든 사용자 정보를 가져오기
      const users = await User.find({}, 'id nickName countPlay'); // 필요한 필드만 선택하여 가져오기

      // 응답 포맷에 맞춰 데이터 가공
      const response = users.map(user => ({
          userId: user.id, 
          nickName: user.nickName,
          countPlay: user.countPlay
      }));
      return res.status(200).json(response);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류입니다.' });
  }
};

// 사용자 제제 로직
exports.banningUser = async (req, res) => {
  const { userId, banDuration, bannedReason } = req.body;

  try {
      // 사용자 존재 여부 확인
      const user = await User.find({ userId: userId });
      if (!user) {
          return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      }

      // 신고를 통해 사용자 제재
      // 해당 사용자의 모든 신고를 가져오기!
      const reports = await Report.find({ reportedUserId: userId });
      if (reports.length === 0) {
          return res.status(404).json({ message: "신고 기록이 없습니다." });
      }

      // 제재 날짜 및 해제 날짜 계산
      const bannedAt = new Date(); // 현재 날짜를 제재 날짜로 사용
      const freedomAt = new Date(bannedAt);
      freedomAt.setDate(bannedAt.getDate() + banDuration); // banDuration을 일 수로 추가

      // 신고 횟수 계산
      const reportCount = reports.length; // 신고 횟수는 모든 신고의 수로 설정

      // 제재 정보 생성
      const newBan = new Ban({
          userId: user.userId,
          nickName : user.nickName,
          reportedAt: reports.map(report => report.createdAt), // 모든 신고당한 날짜를 배열로 저장
          reportCount: reportCount,
          bannedAt: bannedAt,
          freedomAt: freedomAt,
          banDuration: banDuration,
          bannedReason: bannedReason // 관리자가 입력한 제재 사유
      });

      await newBan.save(); // DB에 제재 정보 저장

      return res.status(200).json({ message: `User banned for ${banDuration} days` });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류입니다.(adminController)' });
  }
};

 // 전체 유저 신고 수 조회 로직
exports.allReports = async (req, res) => {
  try {
      // 모든 신고를 가져옵니다.
      const reports = await Report.find();

      // 신고 수를 카운트할 객체를 만듭니다.
      const reportCounts = {};

      // 각 신고를 반복하며 신고자 정보를 수집합니다.
      for (const report of reports) {
          const reportedUserId = report.reportedUserId;
          const reportednickName = report.reportednickName;
          
          // 신고자가 이미 보고된 경우
          if (reportCounts[reportedUserId]) {
              reportCounts[reportedUserId].reportCount += 1; // 신고 수 증가
          } else {
              reportCounts[reportedUserId] = {
                  userId: reportedUserId,
                  nickName: reportednickName, 
                  reportCount: 1, // 신고 수 초기화
              };
          }
      }

      // 결과를 배열로 변환
      const result = Object.values(reportCounts);

      return res.status(200).json(result);
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: '서버 오류입니다. (getAllReports)' });
  }
};


// 쓰레기 생성 속도 조절
exports.setTrashSpeed = async (req, res) => {
  try {
    const { speed } = req.body;
    if (typeof speed !== "number" || speed <= 0) {
      return res.status(400).json({ message: "유효한 속도를 입력해주세요." });
    }
    // Redis에 쓰레기 생성 속도 업데이트
    await redisClient.set("trashGenerationSpeed", speed.toString());
    // 추후 값이 바뀌었음을 알려주기 위해 pub 수행
    await redisClient.publish("trashGenerationSpeed", speed.toString());
    return res
      .status(200)
      .json({ message: "쓰레기 생성 속도가 재설정되었습니다.", speed });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류입니다." });
  }
};

// 쓰레기 생성 속도 반환
exports.getTrashSpeed = async (req, res) => {
  try {
    // Redis에서 쓰레기 생성 속도 가져오기
    const speed = await redisClient.get("trashGenerationSpeed");

    if (!speed) {
      return res
        .status(404)
        .json({ message: "생성 속도가 아직 설정되지 않았습니다." });
    }
    return res.status(200).json({ speed: Number(speed) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류입니다." });
  }
};

// 생성 가능한 최대 쓰레기 양 조절
exports.setTrashLimit = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "유효한 최대 쓰레기 양을 입력해주세요." });
    }
    // Redis에 최대 쓰레기 생성량 업데이트
    await redisClient.set("trashGenerationLimit", quantity.toString());
    // 추후 값이 바뀌었음을 알려주기 위해 pub 수행
    await redisClient.publish("trashGenerationLimit", quantity.toString());
    return res
      .status(200)
      .json({ message: "최대 쓰레기 양이 재설정되었습니다.", quantity });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류입니다." });
  }
};

// 생성 가능한 최대 쓰레기 양 반환
exports.getTrashLimit = async (req, res) => {
  try {
    // Redis에서 최대 쓰레기 생성량 가져오기
    const quantity = await redisClient.get("trashGenerationLimit");

    if (!quantity) {
      return res
        .status(404)
        .json({ message: "최대 쓰레기 생성량이 아직 설정되지 않았습니다." });
    }
    return res.status(200).json({ quantity: Number(quantity) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "서버 오류입니다." });
  }
};

// // 어드민 판별
// exports.isAdmin = async (req, res) => {};



// 관리자 인증 상태 확인 요청 (현성 요청)

exports.validateAdmin = async (req, res) => {
   // req.user는 authMiddleware에서 설정한 사용자 정보

   if (!req.user) {
    return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }

  return res.status(200).json({ message: "관리자 인증 성공"});

};