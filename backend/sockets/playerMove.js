const { redisClient } = require("../config/db");

/**
 * @description 특정 플레이어가 이동하면, 다른 플레이어들에게 해당 플레이어 위치를 전송
 */
exports.playerMove = (io, socket) => {
  socket.on("getMyPosition", async (data) => {
    const { userId, nickName, position } = data;

    // userId를 키로 사용해 유저 데이터를 Redis에 저장
    await redisClient.hSet(
      "player_positions",
      socket.data.userId,
      JSON.stringify({ userId, nickName, position })
    );

    // 저장된 모든 플레이어 정보를 가져와 broadcast
    const players = await redisClient.hGetAll("player_positions");
    const broadcastData = Object.keys(players).map((userId) => ({
      ...JSON.parse(players[userId]),
    }));
    console.log(broadcastData);

    io.emit("updateCharacterPosition", broadcastData);
  });
};

/**
 * @description 특정 플레이어 연결이 끊기면, 해당 플레이어의 이름, 아이디, 좌표를 Redis에서 제거하고 broadcast
 */
exports.playerDisconnect = (socket) => {
  socket.on("disconnect", async () => {
    await redisClient.hDel("player_positions", socket.data.userId);
    console.log(
      `사용자 ${socket.data.userId} 위치 정보가 Redis에서 제거되었습니다.`
    );

    // Redis에 저장되어있는 플레이어들 정보 가져오기
    const players = await redisClient.hGetAll("player_positions");
    const broadcastData = Object.keys(players).map((userId) => ({
      ...JSON.parse(players[userId]),
    }));

    // 가져온 플레이어들 정보를 배열로 바꿔서 broadcast
    socket.broadcast.emit("updateCharacterPosition", broadcastData);
  });
};
