// backend/utils/gameUtils.js

const { redisClient } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
// 이거 고유id를 부여하는 방법 중 하나라, 좀 더 편한 대체 방안 있으면 수정해도 좋아요!

// 유저의 보유 쓰레기량 조회 함수
exports.getUserTrashData = async (userId) => {
  const trashAmount = await redisClient.hGet("user_trash", userId);
  return { userId, trashAmount: parseInt(trashAmount) || 0 };
};

// 랜덤 위치 생성 함수 (좌표 제한 적용)
// 활용도 높아서 같은 파일 내 다른 함수들도 이 유틸 참조합니다 :)
const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * 1280), // x 범위: 0 < x < 1280
    y: Math.floor(Math.random() * 500), // y 범위: 0 < y < 500
  };
};

// 쓰레기 생성 함수
exports.generateTrash = async () => {
  return [{ trashId: uuidv4(), position: generateRandomPosition() }];
};

// 방해요소 생성 함수
exports.generateObstacle = async () => {
  return [{ obstacleId: uuidv4(), position: generateRandomPosition() }];
};

// 아이템 생성 함수
exports.generateItem = async () => {
  return [{ itemId: uuidv4(), position: generateRandomPosition() }];
};
