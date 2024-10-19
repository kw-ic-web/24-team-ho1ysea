// middlewares/authMiddleware.js

const mongoose = require("mongoose");
require("dotenv").config();
// .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 이걸 넘겨준 엔드포인트는 인증된 사용자만 접근할 수 있음
// auth 미들웨어가 먼저 실행되어 인증 과정을 처리함
// 전후처리를 해줌. 지금은 토큰 인증하고 토큰이 유효한지 검증

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "토큰이 없습니다. 인증이 거부되었습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 요청 객체에 사용자 정보 추가

    // 사용자 권한에 따라 다른 상태 코드 설정
    if (user.isAdmin) {
      res.status(204); // 관리자일 경우
    } else {
      res.status(200); // 일반 사용자일 경우
    }

    next(); //  미들웨어 1개만 유지  & (현성이 요청대로) 상이한 응답코드  

  } catch (err) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};