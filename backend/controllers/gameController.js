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

// 사거리 조회
exports.getMyRange = (req, res) => {
    const userId = req.user.id;
    const range = userRanges[userId] || 10; // 기본값 10
    res.json({ range });
  };  

// 사거리 증가
exports.increaseMyRange = (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;
  
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: "유효한 증가량을 입력해주세요." });
    }
  
    userRanges[userId] = (userRanges[userId] || 10) + amount; // 증가량 적용
    res.json({ range: userRanges[userId] });
  };
  
// 이동 속도 및 사거리 초기화  
exports.resetSpeedAndRange = (req, res) => {
    const userId = req.user.id;
    const { speed, range } = req.body;
  
    userSpeeds[userId] = speed; // 초기화
    userRanges[userId] = range; // 초기화
    res.json({ message: "이동 속도 및 사거리가 초기화되었습니다." });
  };  