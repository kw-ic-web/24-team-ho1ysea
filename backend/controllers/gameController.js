// controllers/gameController.js

let userSpeeds = {}; // 사용자별 이동 속도 저장
let userRanges = {}; // 사용자별 사거리 저장

// 이동속도 조회
exports.getMySpeed = (req, res) => {
  const userId = req.user.id;
  const speed = userSpeeds[userId] || 5; // 기본값 5
  res.json({ speed });
};

// 이동속도 증가  (편의상 조회랑 위치 가까이해둠. 사거리도 마찬가지)
exports.increaseMySpeed = (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;
  
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: "유효한 증가량을 입력해주세요." });
    }
  
    userSpeeds[userId] = (userSpeeds[userId] || 5) + amount; // 증가량 적용
    res.json({ speed: userSpeeds[userId] });
  };