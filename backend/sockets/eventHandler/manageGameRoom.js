// backend/sockets/eventHandler/manageGameRoom.js

const {
  removeUserData,
  getTrashPositions,
  getObstaclePositions,
  getItemPositions,
  getLeaderBoard,
} = require("../../utils/redisHandler");

/**
 * @description 특정 플레이어가 바다로 이동 시 room에 추가
 */
exports.joinGameRoom = (io, socket) => {
  socket.on("joinGame", async (userId) => {
    console.log(`${userId}가 gameRoom에 접속했습니다.`);
    socket.join("gameRoom");

    // 방에 새로 들어온 유저에게 게임 데이터를 모두 전달
    const trashes = await getTrashPositions();
    const obstacles = await getObstaclePositions();
    const items = await getItemPositions();
    const topUsers = await getLeaderBoard();
    socket.emit("generateRandomTrash", trashes);
    socket.emit("generateRandomObstacle", obstacles);
    socket.emit("generateRandomItem", items);
    socket.emit("getLeaderBoard", topUsers);
  });
};

/**
 * @description 특정 플레이어가 해변으로 이동 시 gameRoom에서 제거하고 Redis에서도 제거
 */
exports.leaveGameRoom = (io, socket) => {
  socket.on("leaveGame", async (userId) => {
    console.log(`${userId}가 gameRoom에서 나갔습니다.`);
    socket.leave("gameRoom");

    // gameRoom에서 나간 플레이어를 Redis에서 제거
    const broadcastData = await removeUserData(userId);

    // 방에서 나간 유저에게 게임 데이터를 모두 제거하도록 emit
    socket.emit("updateCharacterPosition", []);
    socket.emit("generateRandomTrash", []);
    socket.emit("generateRandomObstacle", []);
    socket.emit("generateRandomItem", []);

    // 제거하고 남은 플레이어들 정보를 gameRoom 방 전체에 브로드캐스트
    io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
  });
};
