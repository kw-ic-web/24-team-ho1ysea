const { redisClient } = require("../config/db");

/**
 * @description 특정 플레이어가 이동하면, 다른 플레이어들에게 해당 플레이어 위치를 전송
 */
exports.playerMove = (io, socket) => {
  socket.on("getMyPosition", async (data) => {
    const { userId, nickName, position } = data;

    // Redis에 userId를 키로 가지고, nickName과 position을 value로 가지는 해시셋으로 저장
    await redisClient.hSet(
      "player_positions",
      socket.id,
      JSON.stringify({ userId, nickName, position })
    );

    // Redis에 저장되어있는 플레이어들 정보 가져오기
    const players = await redisClient.hGetAll("player_positions");
    const broadcastData = Object.keys(players).map((socketId) => ({
      ...JSON.parse(players[socketId]),
    }));

    // 가져온 플레이어들 정보를 배열로 바꿔서 전체 유저에게 broadcast
    // (socket.broadcast.emit 쓰니까 초기 접속자는 주변 플레이어가 움직이기 전까지 안보이는 문제가 있었음)
    io.emit("updateCharacterPosition", broadcastData);
  });
};

/**
 * @description 특정 플레이어 연결이 끊기면, 해당 플레이어의 이름, 아이디, 좌표를 Redis에서 제거하고 broadcast
 */
exports.playerDisconnect = (socket) => {
  socket.on("disconnect", async () => {
    await redisClient.hDel("player_positions", socket.id);
    console.log(`사용자 ${socket.id} 위치 정보가 Redis에서 제거되었습니다.`);

    // Redis에 저장되어있는 플레이어들 정보 가져오기
    const players = await redisClient.hGetAll("player_positions");
    const broadcastData = Object.keys(players).map((socketId) => ({
      ...JSON.parse(players[socketId]),
    }));

    // 가져온 플레이어들 정보를 배열로 바꿔서 broadcast
    socket.broadcast.emit("updateCharacterPosition", broadcastData);
  });
};
