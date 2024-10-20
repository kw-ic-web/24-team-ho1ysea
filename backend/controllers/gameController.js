// controllers/gameController.js

let userSpeeds = {}; // 사용자별 이동 속도 저장
let userRanges = {}; // 사용자별 사거리 저장

// 이동속도 조회
exports.getMySpeed = (req, res) => {
  const userId = req.user.id;
  const speed = userSpeeds[userId] || 5; // 기본값 5
  res.json({ speed });
};
