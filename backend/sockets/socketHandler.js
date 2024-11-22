// backend/sockets/socketHandler.js

const { playerMove } = require("./eventHandler/playerMove");
const {
  joinGameRoom,
  leaveGameRoom,
} = require("./eventHandler/manageGameRoom");
const {
  removeUserData,
  removeUserSpeed,
  removeUserRange,
} = require("../utils/redisHandler");
const {
  generateRandomTrash,
  generateRandomObstacle,
  generateRandomItem,
} = require("./eventHandler/gameEvent");
const { playerStatus } = require("./eventHandler/playerStatus");
const { redisClient } = require("../config/db");
const { removeUserTrashAmount } = require("../utils/gameUtils");

// userId-socketId 매핑
const userSocketIdMap = new Map(); // key: userId, value: socketId

module.exports = socketHandler = (io) => {
  /* 게임 요소들 생성 interval 이벤트들은 "한번만" 실행되야 함.
     기존 위치에 두면, 플레이어가 입장할때마다 interval 이벤트들이 중복으로 등록되게 됨!
     그래서 위로 뺐다!
     추가로, 그냥 빼니까 redisClient 초기화 이전에 실행되면서 에러 발생했음
     그래서 redisClient가 connect 된 뒤에 한 번만 실행시키는 방식으로 최종 해결 */
  redisClient.on("connect", () => {
    generateRandomTrash(io);
    generateRandomObstacle(io);
    generateRandomItem(io);
  });

  io.on("connection", (socket) => {
    // 소켓 연결을 하는 과정에서 (handshake) userId를 받아 미리 저장해둠!
    console.log("사용자 연결:", socket.handshake.query.userId);
    socket.data = { userId: socket.handshake.query.userId };
    // userId - socketId 맵에 추가
    userSocketIdMap.set(socket.handshake.query.userId, socket.id);

    // 여기에 각 소켓 컨트롤러 함수들을 넣어주면 될듯
    joinGameRoom(io, socket);
    leaveGameRoom(io, socket);
    playerMove(io, socket);
    playerStatus(io, userSocketIdMap);
    // getUserTrash(socket);

    // 소켓 연결이 끊겼을 때
    socket.on("disconnect", async () => {
      // 연결 해제된 플레이어와 관련된 데이터를 Redis에서 제거
      const broadcastData = await removeUserData(socket.data.userId);
      await removeUserSpeed(socket.data.userId);
      await removeUserRange(socket.data.userId);
      await removeUserTrashAmount(socket.data.userId);

      // userId - socketId 맵에서 제거
      userSocketIdMap.delete(socket.handshake.query.userId);
      // 제거하고 남은 플레이어들 정보를 gameRoom 방 전체에 브로드캐스트
      io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
    });
  });
};
