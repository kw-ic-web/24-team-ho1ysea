const mongoose = require('mongoose');

// 신고 스키마 정의
const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: String,
    ref: 'User', // User 모델과의 참조 관계 설정
    required: true,
  },
  reportedUserId: {
    type: String,
    ref: 'User', // User 모델과의 참조 관계 설정
    required: true,
  },
  reason: {
    type: String,
    required: true, // 신고 사유 필수 입력
  },
  createdAt: {
    type: Date,
    default: Date.now, // 신고가 생성된 날짜
  },
});

// 신고 모델 생성
const Report = mongoose.model('Report', ReportSchema);

// 내보내기
module.exports = Report;
