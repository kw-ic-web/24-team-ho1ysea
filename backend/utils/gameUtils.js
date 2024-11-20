// backend/utils/gameUtils.js

const { redisClient } = require("../config/db");
const {
  updateTrashPositions,
  getTrashPositions,
  updateObstaclePositions,
  getObstaclePositions,
  updateItemPositions,
  getItemPositions,
  removeTrashPosition,
  removeItemPosition,
  removeObstaclePosition,
} = require("./redisHandler");
const { v4: uuidv4 } = require("uuid");
// 이거 고유id를 부여하는 방법 중 하나라, 좀 더 편한 대체 방안 있으면 수정해도 좋아요!
// Mongoose 모델 임포트
const Item = require("../models/item");
const Trash = require("../models/trash");
const Obstacle = require("../models/obstacle");

// 두 위치 간의 충돌 여부를 판단하는 함수
function isColliding(position1, position2, collisionDistance = 50) {
  const distance = Math.sqrt(
    Math.pow(position1.x - position2.x, 2) +
      Math.pow(position1.y - position2.y, 2)
  ); // 유클리디안 거리 사용
  return distance < collisionDistance;
}

// 유저의 보유 쓰레기량 조회 함수
exports.getUserTrashData = async (userId) => {
  const trashAmount = await redisClient.hGet("user_trash", userId);
  return { userId, trashAmount: parseInt(trashAmount) || 0 };
};

// 랜덤 위치 생성 함수 (좌표 제한 적용)
// 활용도 높아서 같은 파일 내 다른 함수들도 이 유틸 참조합니다 :)
const generateRandomPosition = () => {
  const px = 50;
  const py = 50;
  const w = 1280 - 2 * px;
  const h = 500 - 2 * py;

  return {
    x: Math.round(Math.random() * w) + px, // x 범위: 50 < x < 1230
    y: Math.round(Math.random() * h) + py, // y 범위: 50 < y < 450
  };
};

// 쓰레기 생성 함수
exports.generateTrash = async () => {
  // 데이터베이스에서 총 쓰레기 개수 가져오기
  const trashCount = await Trash.countDocuments();

  if (trashCount === 0) {
    throw new Error("데이터베이스에 쓰레기가 없습니다.");
  }

  // 랜덤 인덱스 생성
  const randomIndex = Math.floor(Math.random() * trashCount);

  // 랜덤한 쓰레기 아이템 가져오기
  const randomTrash = await Trash.findOne().skip(randomIndex).exec();

  const objectId = uuidv4();
  const trashId = randomTrash.trashId; // Trash 모델의 trashId 필드 사용
  const position = generateRandomPosition();

  // Redis에 업데이트
  await updateTrashPositions(objectId, trashId, position);

  // 업데이트된 전체 쓰레기 데이터 가져오기
  const trashList = await getTrashPositions();
  return trashList;
};

// 방해요소 생성 함수
exports.generateObstacle = async () => {
  // 데이터베이스에서 총 방해요소 개수 가져오기
  const obstacleCount = await Obstacle.countDocuments();

  if (obstacleCount === 0) {
    throw new Error("데이터베이스에 방해요소가 없습니다.");
  }

  // 랜덤 인덱스 생성
  const randomIndex = Math.floor(Math.random() * obstacleCount);

  // 랜덤한 방해요소 가져오기
  const randomObstacle = await Obstacle.findOne().skip(randomIndex).exec();

  const objectId = uuidv4();
  const obstacleId = randomObstacle.obstacleId; // Obstacle 모델의 obstacleId 필드 사용
  const position = generateRandomPosition();

  // Redis에 저장
  await updateObstaclePositions(objectId, obstacleId, position);

  // 업데이트된 전체 방해요소 데이터 가져오기
  const obstacleList = await getObstaclePositions();
  return obstacleList;
};

// 아이템 생성 함수
exports.generateItem = async () => {
  // 데이터베이스에서 총 아이템 개수 가져오기
  const itemCount = await Item.countDocuments();

  if (itemCount === 0) {
    throw new Error("데이터베이스에 아이템이 없습니다.");
  }

  // 랜덤 인덱스 생성
  const randomIndex = Math.floor(Math.random() * itemCount);

  // 랜덤한 아이템 가져오기
  const randomItem = await Item.findOne().skip(randomIndex).exec();

  const objectId = uuidv4();
  const itemId = randomItem.itemId; // Item 모델의 itemId 필드 사용
  const position = generateRandomPosition();

  // Redis에 업데이트
  await updateItemPositions(objectId, itemId, position);

  // 업데이트된 전체 아이템 데이터 가져오기
  const itemList = await getItemPositions();
  return itemList;
};

// 충돌 체크 함수
exports.checkCollision = async (userId, position, collisionDistance = 50) => {
  // 쓰레기와의 충돌 체크
  const trashList = await getTrashPositions();
  for (let trash of trashList) {
    if (isColliding(position, trash.position, collisionDistance)) {
      // 충돌한 쓰레기를 Redis에서 제거
      await removeTrashPosition(trash.objectId);
      console.log(`쓰레기 ${trash.objectId}를 수집했습니다.`);
      // 충돌한 쓰레기 정보를 반환
      const updatedTrashList = await getTrashPositions();
      return { type: "trash", data: updatedTrashList };
    }
  }

  // 아이템과의 충돌 체크
  const itemList = await getItemPositions();
  for (let item of itemList) {
    if (isColliding(position, item.position, collisionDistance)) {
      // 충돌한 아이템을 Redis에서 제거
      await removeItemPosition(item.objectId);
      console.log(`아이템 ${item.objectId}를 수집했습니다.`);
      // 충돌한 아이템 정보를 반환
      const updatedItemList = await getItemPositions();
      return { type: "item", data: updatedItemList };
    }
  }

  // 장애물과의 충돌 체크
  const obstacleList = await getObstaclePositions();
  for (let obstacle of obstacleList) {
    if (isColliding(position, obstacle.position, collisionDistance)) {
      // 충돌한 장애물을 Redis에서 제거
      await removeObstaclePosition(obstacle.objectId);
      console.log(`장애물 ${obstacle.objectId}에 충돌했습니다.`);
      // 충돌한 장애물 정보를 반환
      const updatedObstacleList = await getObstaclePositions();
      return { type: "obstacle", data: updatedObstacleList };
    }
  }

  // 충돌이 없는 경우 null 반환
  // 클라이언트에게 collision event를 발생시키지 않음
  return null;
};
