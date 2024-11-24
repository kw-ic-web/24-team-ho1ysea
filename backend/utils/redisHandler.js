const { BASE_SPEED, BASE_RANGE } = require("../config/constant");
const { redisClient } = require("../config/db");
const { makeLeaderBoard } = require("./makeLeaderBoard");

// 유저의 보유 쓰레기량 조회 함수
exports.getUserTrashData = async (userId) => {
  const trashAmount = await redisClient.hGet("user_trash", userId);
  return { userId, trashAmount: parseInt(trashAmount) || 0 };
};

// 유저의 보유 쓰레기량을 증가시키고, leaderboard 채널로 publish한 뒤 반환하는 함수
exports.updateUserTrashAmount = async (userId, increase) => {
  // 해당 유저가 처음 쓰레기를 주울 때는 Redis에 값이 없을거임
  const trashAmount = (await redisClient.hGet("user_trash", userId)) || "0";
  await redisClient.hSet(
    "user_trash",
    userId,
    JSON.stringify(parseFloat(trashAmount) + increase)
  );

  // 업데이트를 했으면, 전체를 받아와서 publish 수행
  const userTrashData = await redisClient.hGetAll("user_trash");
  await redisClient.publish("leaderboard", JSON.stringify(userTrashData));

  return parseFloat(trashAmount) + increase;
};

// 유저의 보유 쓰레기량을 제거하는 함수
exports.removeUserTrashAmount = async (userId) => {
  console.log(userId);
  await redisClient.hDel("user_trash", userId);

  // 유저 쓰레기량을 제거한 뒤, 전체를 받아와서 publish 수행
  const userTrashData = await redisClient.hGetAll("user_trash");
  await redisClient.publish("leaderboard", JSON.stringify(userTrashData));
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

// 리더보드 데이터를 가져오는 함수
exports.getLeaderBoard = async () => {
  // Redis에서 모든 유저와 쓰레기량 데이터 가져오기
  const userTrashData = await redisClient.hGetAll("user_trash");

  const topUsers = makeLeaderBoard(userTrashData);
  return topUsers;
};

// 연결 해제된 플레이어를 플레이어 포지션 Redis에서 제거하고, 남은 전체 데이터 리턴
exports.removeUserData = async (userId) => {
  await redisClient.hDel("playerPositions", userId);
  // console.log(`사용자 ${userId} 위치 정보가 Redis에서 제거되었습니다.`);

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
  const newObstacle = { objectId, obstacleId, position, isActive: 0 };
  await redisClient.lPush("obstaclePositions", JSON.stringify(newObstacle));
  return true;
};

// 방해요소를 1초 후 상태 업데이터 (0 -> 1)
exports.updateObstacleStatus = async (objectId, obstacleId, position) => {
  const newObstacle = { objectId, obstacleId, position, isActive: 1 };
  await this.removeObstaclePosition(objectId);

  await redisClient.lPush("obstaclePositions", JSON.stringify(newObstacle));
  return true;
};

// 전체 방해요소 데이터 리턴
exports.getObstaclePositions = async () => {
  const obstacleList = await redisClient.lRange("obstaclePositions", 0, -1);
  return obstacleList.map((item) => JSON.parse(item));
};

// 새로 생성한 아이템(게임 맵에 떠있는)을 Redis에 저장
exports.updateItemPositions = async (objectId, itemId, image, position) => {
  const newItem = { objectId, itemId, image, position }; // 이미지명도 추가
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

  for (let trash of trashList) {
    const parsedTrash = JSON.parse(trash);
    if (parsedTrash.objectId === objectId) {
      await redisClient.lRem("trashPositions", 1, trash);
      // console.log(`쓰레기 ${objectId}가 제거되었습니다.`);
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
      // console.log(`아이템 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
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

/**
 * @description key: userId, value: speed 해시 데이터에서 특정 유저의 speed를 반환
 * @param {string} userId
 * @returns {Promise<number>}
 */
exports.getUserSpeed = async (userId) => {
  try {
    const speed = await redisClient.hGet("userSpeed", userId);
    // 기존에 값이 있으면 가져오고, 없으면 기본값으로 설정하고 리턴
    if (speed) {
      return parseFloat(speed);
    } else {
      await this.setUserSpeed(userId, BASE_SPEED);
      return BASE_SPEED;
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description key: userId, value: speed 해시 데이터에서 특정 유저의 speed를 새로운 speed로 변경
 * @param {string} userId
 * @param {number} speed
 * @returns {Promise<void>}
 */
exports.setUserSpeed = async (userId, speed) => {
  try {
    await redisClient.hSet("userSpeed", userId, speed.toString());
    // 값이 바뀌었음을 알려주기 위해 pub 수행
    await redisClient.publish("userSpeed", JSON.stringify({ userId, speed }));
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description 특정 userId에 해당하는 speed 데이터를 삭제
 * @param {string} userId
 * @returns {Promise<void>}
 */
exports.removeUserSpeed = async (userId) => {
  try {
    await redisClient.hDel("userSpeed", userId);
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description key:userId, value: range 해시 데이터에서 특정 유저의 range를 반환
 * @param {string} userId
 * @returns {Promise<number>}
 */
exports.getUserRange = async (userId) => {
  try {
    const range = await redisClient.hGet("userRange", userId);
    if (range) {
      return parseFloat(range);
    } else {
      await this.setUserRange(userId, BASE_RANGE);
      return BASE_RANGE;
    }
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description key: userId, value: range 해시 데이터에서 특정 유저의 range 새로운 range로 변경
 * @param {string} userId
 * @param {number} range
 * @returns {Promise<void>}
 */
exports.setUserRange = async (userId, range) => {
  try {
    await redisClient.hSet("userRange", userId, range.toString());
    await redisClient.publish("userRange", JSON.stringify({ userId, range }));
  } catch (e) {
    console.error(e);
  }
};

/**
 * @description 특정 userId에 해당하는 range 데이터를 삭제
 * @param {string} userId
 * @returns {Promise<void>}
 */
exports.removeUserRange = async (userId) => {
  try {
    await redisClient.hDel("userRange", userId);
  } catch (e) {
    console.error(e);
  }
};
