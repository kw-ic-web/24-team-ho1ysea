const mongoose = require("mongoose");

// 제재 스키마 정의
const RestrictSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델과의 참조 관계 설정
    required: true,
  },
  reportedAt: {
    type: Date,
    required: true, // 신고당한 날짜
  },
  reportCount: {
    type: Number,
    default: 0, // 신고당한 횟수
  },
  restrictedAt: {
    type: Date,
    default: Date.now, // 제재 시작 날짜
  },
  freedomAt: {
    type: Date, // 해제 날짜
  },
  banDuration: {
    type: Number, // 제재 기간(일수)
    required: true,
  }
});

// 제재 모델 생성
const Restrict = mongoose.model("Restrict", RestrictSchema);

// 내보내기
module.exports = Restrict;
