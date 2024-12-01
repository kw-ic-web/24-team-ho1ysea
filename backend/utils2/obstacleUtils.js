// backend/utils/obstacleUtils.js

const { redisClient } = require("../config/db");

// 새로 생성한 방해요소를 Redis에 저장
exports.updateObstaclePositions = async (objectId, obstacleId, position) => {
  const newObstacle = { objectId, obstacleId, position, isActive: 0 };
  await redisClient.lPush("obstaclePositions", JSON.stringify(newObstacle));
  return true;
};

// 전체 방해요소 데이터 리턴
exports.getObstaclePositions = async () => {
  const obstacleList = await redisClient.lRange("obstaclePositions", 0, -1);
  return obstacleList.map((item) => JSON.parse(item));
};

// 특정 장애물을 Redis에서 제거하는 함수
exports.removeObstaclePosition = async (objectId) => {
  const obstacleList = await redisClient.lRange("obstaclePositions", 0, -1);

  for (let obstacle of obstacleList) {
    const parsedObstacle = JSON.parse(obstacle);
    if (parsedObstacle.objectId === objectId) {
      await redisClient.lRem("obstaclePositions", 1, obstacle);
      // console.log(`장애물 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
};

// 방해요소를 1초 후 상태 업데이터 (0 -> 1)
exports.updateObstacleStatus = async (objectId, obstacleId, position) => {
  const newObstacle = { objectId, obstacleId, position, isActive: 1 };
  await this.removeObstaclePosition(objectId);

  await redisClient.lPush("obstaclePositions", JSON.stringify(newObstacle));
  return true;
};
