const mongoose = require("mongoose");

// 신고 스키마 정의
const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: String,
    ref: "User", // User 모델과의 참조 관계 설정

    required: true,
  },
  reportedUserId: {
    type: String,
    ref: "User", // User 모델과의 참조 관계 설정
    required: true,
  },
  reportednickName: { // 닉네임 필드 추가
    type: String,
    ref: "User",
    required: true 
    // 신고당한 닉네임 갑자기 왜 추가했냐면, 다음 아이디어들 참고
    // 1. 신고자는 userId가 아니라 닉네임을 보고 신고하지 않을까?(라면서 신고자id도 keep해둔 건 안 비밀)
    // 2. 관리자가 신고자별 신고 횟수 조회할 때 로직을 바꾸기 복잡
    // 3. 스키마 조정이 2번보다 비교적 간단함.(2번은 allReports 참고. gpt가 짜줬는데 감탄함.)
    //    ㄴ 아 근데 신고 생성 로직, 신고 스키마, 제재 스키마 싹 수정하니 불안..ㅎ
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
const Report = mongoose.model("Report", ReportSchema);

// 내보내기
module.exports = Report;
