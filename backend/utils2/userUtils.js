// backend/utils/userUtils.js

const { BASE_SPEED, BASE_RANGE } = require("../config/constant");
const { redisClient } = require("../config/db");

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
