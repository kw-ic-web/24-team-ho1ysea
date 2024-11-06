// backend/sockets/eventHandler/gameEvents.js

const {
  getUserTrashData,
  generateTrash,
  generateObstacle,
  generateItem,
} = require("../../utils/gameUtils");

// 유저 보유 쓰레기량 조회 이벤트
exports.getUserTrash = (socket) => {
  socket.on("getUserTrash", async (userId) => {
    try {
      const trashData = await getUserTrashData(userId);
      socket.emit("getUserTrash", trashData); // 클라이언트에 유저 쓰레기 데이터 전달
    } catch (error) {
      console.error("getUserTrash Error:", error);
    }
  });
};

// 쓰레기 랜덤 생성 이벤트
exports.generateRandomTrash = (io) => {
  setInterval(async () => {
    const trashData = await generateTrash();
    io.to("gameRoom").emit("generateRandomTrash", trashData); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
  }, 5000);
};

// 방해요소 랜덤 생성 이벤트
exports.generateRandomObstacle = (io) => {
  setInterval(async () => {
    const obstacleData = await generateObstacle();
    io.to("gameRoom").emit("generateRandomObstacle", obstacleData); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
  }, 10000);
};

// 아이템 랜덤 생성 이벤트
exports.generateRandomItem = (io) => {
  setInterval(async () => {
    const itemData = await generateItem();
    io.to("gameRoom").emit("generateRandomItem", itemData);
  }, 15000);
};
