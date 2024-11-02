const { redisClient } = require("../config/db");

exports.removeUserData = async (userId) => {
  // 연결 해제된 플레이어를 Redis에서 제거
  await redisClient.hDel("player_positions", userId);
  console.log(`사용자 ${userId} 위치 정보가 Redis에서 제거되었습니다.`);

  // Redis에 저장되어있는 플레이어들 정보 가져오기
  const players = await redisClient.hGetAll("player_positions");
  const broadcastData = Object.keys(players).map((userId) => ({
    ...JSON.parse(players[userId]),
  }));

  return broadcastData;
};

exports.updateUserData = async (userId, nickName, position) => {
  // userId를 키로 사용해 유저 데이터를 Redis에 저장
  await redisClient.hSet(
    "player_positions",
    userId,
    JSON.stringify({ userId, nickName, position })
  );

  // 저장된 모든 플레이어 정보를 가져오기
  const players = await redisClient.hGetAll("player_positions");
  const broadcastData = Object.keys(players).map((userId) => ({
    ...JSON.parse(players[userId]),
  }));

  return broadcastData;
};
