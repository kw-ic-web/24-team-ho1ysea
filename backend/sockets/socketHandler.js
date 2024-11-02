const { playerMove } = require("./playerMove");
const { joinGameRoom, leaveGameRoom } = require("./manageGameRoom");
const { removeUserData } = require("../utils/redisHandler");

module.exports = socketHandler = (io) => {
  io.on("connection", (socket) => {
    // 소켓 연결을 하는 과정에서 (handshake) userId를 받아 미리 저장해둠!
    console.log("사용자 연결:", socket.handshake.query.userId);
    socket.data = { userId: socket.handshake.query.userId };

    // 여기에 각 소켓 컨트롤러 함수들을 넣어주면 될듯
    joinGameRoom(io, socket);
    leaveGameRoom(io, socket);
    playerMove(io, socket);

    // 소켓 연결이 끊겼을 때
    socket.on("disconnect", async () => {
      // 연결 해제된 플레이어를 Redis에서 제거
      const broadcastData = await removeUserData(socket.data.userId);
      // 제거하고 남은 플레이어들 정보를 gameRoom 방 전체에 브로드캐스트
      io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
    });
  });
};
