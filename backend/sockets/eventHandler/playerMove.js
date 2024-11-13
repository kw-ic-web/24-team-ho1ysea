// backend/sockets/eventHandler/playerMove.js

const { updateUserData } = require("../../utils/redisHandler");

/**
 * @description 특정 플레이어가 이동하면, gameRoom 내의 모든 플레이어들에게 브로드캐스트
 */
exports.playerMove = (io, socket) => {
  socket.on("getMyPosition", async (data) => {
    const { userId, nickName, position } = data;

    // 해당 플레이어가 gameRoom에 들어와 있는지 여부
    const isEnterRoom = socket.rooms.has("gameRoom");

    // 사용자가 gameRoom에 join 되어있지 않으면, Redis에 적용 X
    if (!isEnterRoom) return;

    // 사용자가 gameRoom에 join 되어있으면, Redis에 업데이트
    const broadcastData = await updateUserData(userId, nickName, position);

    // console.log(broadcastData);

    // 충돌 체크 수행 (collisionDistance가 있으면 사용하고, 없으면 기본값 50 사용)
    const collisionResult = await checkCollision(userId, position);

    // 충돌이 발생한 경우 클라이언트에게 알림
    if (collisionResult) {
      socket.emit("collision", collisionResult);
    }

    // gameRoom 방 전체에 브로드캐스트
    io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
  });
};
