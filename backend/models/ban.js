const mongoose = require("mongoose");

// 제재 스키마 정의
const BanSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: "User", // User 모델과의 참조 관계 설정
    required: true,
  },
  nickName: {
    type: String,
    ref: "User", // User 모델과의 참조 관계 설정
    required: true,
  },
  reportedAt: {
    type: [Date],
    required: true, // 신고당한 날짜
  },
  reportCount: {
    type: Number,
    default: 0, // 신고당한 횟수
  },
  bannedAt: {
    type: Date,
    default: Date.now, // 제재 시작 날짜
  },
  freedomAt: {
    type: Date, // 해제 날짜
    default: null,
  },
  banDuration: {
    type: Number, // 제재 기간(일수)
    required: true,
  },
  bannedReason: {
    type: String, // 제재 사유
    required: true,
  }, // ex. 신고 사유 : "뉴비 등쳐먹고 다녀요" -> 제재 사유 : "비매너 및 사기"
});

// 제재 모델 생성
const Ban = mongoose.model("Ban", BanSchema);

// 내보내기
module.exports = Ban;
