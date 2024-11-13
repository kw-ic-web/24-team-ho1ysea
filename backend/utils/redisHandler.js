const { redisClient } = require("../config/db");

// 연결 해제된 플레이어를 플레이어 포지션 Redis에서 제거하고, 남은 전체 데이터 리턴
exports.removeUserData = async (userId) => {
  await redisClient.hDel("playerPositions", userId);
  console.log(`사용자 ${userId} 위치 정보가 Redis에서 제거되었습니다.`);

  // Redis에 저장되어있는 플레이어들 정보 가져오기
  const players = await redisClient.hGetAll("playerPositions");
  const broadcastData = Object.keys(players).map((userId) => ({
    ...JSON.parse(players[userId]),
  }));

  return broadcastData;
};

// userId를 키로 사용해 플레이어 포지션 Redis에 저장/업데이트 후, 전체 데이터 리턴
exports.updateUserData = async (userId, nickName, position) => {
  await redisClient.hSet(
    "playerPositions",
    userId,
    JSON.stringify({ userId, nickName, position })
  );

  // 저장된 모든 플레이어 정보를 가져오기
  const players = await redisClient.hGetAll("playerPositions");
  const broadcastData = Object.keys(players).map((userId) => ({
    ...JSON.parse(players[userId]),
  }));

  return broadcastData;
};

// 새로 생성한 쓰레기를 Redis에 저장
exports.updateTrashPositions = async (objectId, trashId, position) => {
  const newTrash = { objectId, trashId, position };
  // 직렬화해서 Redis에 저장
  await redisClient.lPush("trashPositions", JSON.stringify(newTrash));
  return true;
};

// 전체 쓰레기 데이터 리턴
exports.getTrashPositions = async () => {
  // 전체 쓰레기 리스트 반환
  // redisClient.lRange(key, start, stop) 메서드를 사용하여,리스트를 가져옴
  // 매개변수 0은 시작, -1은 끝을 의미함.
  const trashList = await redisClient.lRange("trashPositions", 0, -1);

  // 아이템 개별로 파싱해서 값 리턴
  return trashList.map((item) => JSON.parse(item));
};

// 새로 생성한 방해요소를 Redis에 저장
exports.updateObstaclePositions = async (objectId, obstacleId, position) => {
  const newObstacle = { objectId, obstacleId, position };
  await redisClient.lPush("obstaclePositions", JSON.stringify(newObstacle));
  return true;
};

// 전체 방해요소 데이터 리턴
exports.getObstaclePositions = async () => {
  const obstacleList = await redisClient.lRange("obstaclePositions", 0, -1);
  return obstacleList.map((item) => JSON.parse(item));
};

// 새로 생성한 아이템(게임 맵에 떠있는)을 Redis에 저장
exports.updateItemPositions = async (objectId, itemId, position) => {
  const newItem = { objectId, itemId, position };
  await redisClient.lPush("itemPositions", JSON.stringify(newItem));
  return true;
};

// 전체 아이템(게임 맵에 떠있는) 데이터 리턴
exports.getItemPositions = async () => {
  const itemList = await redisClient.lRange("itemPositions", 0, -1);
  return itemList.map((item) => JSON.parse(item));
};

// 특정 쓰레기를 Redis에서 제거하는 함수
exports.removeTrashPosition = async (objectId) => {
  const trashList = await redisClient.lRange("trashPositions", 0, -1);

  for (let item of trashList) {
    const parsedItem = JSON.parse(item);
    if (parsedItem.objectId === objectId) {
      await redisClient.lRem("trashPositions", 1, item);
      console.log(`쓰레기 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
};

// 특정 아이템을 Redis에서 제거하는 함수
exports.removeItemPosition = async (objectId) => {
  const itemList = await redisClient.lRange("itemPositions", 0, -1);

  for (let item of itemList) {
    const parsedItem = JSON.parse(item);
    if (parsedItem.objectId === objectId) {
      await redisClient.lRem("itemPositions", 1, item);
      console.log(`아이템 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
};
