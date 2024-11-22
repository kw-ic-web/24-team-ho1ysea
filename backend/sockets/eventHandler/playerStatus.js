const { subscriber } = require("../../config/db");

/**
 * @description 특정 유저의 speed/range가 변경되면, 그 유저에게 새 speed/range를 emit
 */
exports.playerStatus = (io, userSocketIdMap) => {
  subscriber.subscribe("userSpeed", (data) => {
    const { userId, speed } = JSON.parse(data);
    const targetSocketId = userSocketIdMap.get(userId);
    io.to(targetSocketId).emit("getPlayerSpeed", speed);
  });

  subscriber.subscribe("userRange", (data) => {
    const { userId, range } = JSON.parse(data);
    const targetSocketId = userSocketIdMap.get(userId);
    io.to(targetSocketId).emit("getPlayerRange", range);
  });
};
