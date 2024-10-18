// models/user.js
const mongoose = require("mongoose");

// 사용자 스키마 설계
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  // 바다이야기 시트를 원칙으로 하여 api 테스트를 해야 할 것이라 생각하여 추가했어요
  nickName: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false }, // 기본값 false
  topRate: { type: Number, default: 0 },
  coin: { type: Number, default: 0 },
  countPlay: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "withdrawnPlanned", "withdrawn"], // 활성 상태, (탈퇴)예정 상태, 탈퇴 상태
    default: "active",
  },
});

// 사용자 모델 생성
const User = mongoose.model("User", userSchema);

// 내보내기
module.exports = User;
