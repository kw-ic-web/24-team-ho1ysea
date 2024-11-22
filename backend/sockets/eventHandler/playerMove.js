// backend/sockets/eventHandler/playerMove.js

const obstacle = require("../../models/obstacle");
const {
  checkCollision,
  updateUserTrashAmount,
} = require("../../utils/gameUtils");
const { updateUserData, removeUserData } = require("../../utils/redisHandler");

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

    // 충돌 체크 수행 (checkCollision 함수 내에서 redis로 해당 플레이어 사거리 가져옴)
    const collisionResult = await checkCollision(userId, position);

    // 쓰레기와 충돌이 발생한 경우 클라이언트에게 알림
    if (collisionResult && collisionResult.type === "trash") {
      // 전체 플레이어한테는 쓰레기가 사라짐을 전달하고
      io.to("gameRoom").emit("collisionTrash", collisionResult.data);
      // 쓰레기와 충돌한 플레이어에게는 업데이트된 trashAmount도 전달
      const trashAmount = await updateUserTrashAmount(
        socket.data.userId,
        collisionResult.id === "trash001" ? 2 : 1
      );
      socket.emit("getTrashAmount", trashAmount);
    } else if (collisionResult && collisionResult.type === "item") {
      // 전체 플레이어한테는 아이템이 사라짐을 전달하고
      io.to("gameRoom").emit("collisionItem", collisionResult.data);
      // 아이템과 충돌한 플레이어에게 아이템 충돌했다고 알려주면서 충돌한 itemId를 전달
      console.log("충돌한 아이템 정보:", collisionResult.id);
      socket.emit("getItem", collisionResult.id);
      // 프론트에서는 이 이벤트를 수신하면 item 습득 API로 다시 요청을 날리고, 인벤토리 정보를 새로고침함
    } else if (collisionResult.type === "obstacle") {
      // 전체 플레이어에게 장애물이 사라졌음을 알림
      io.to("gameRoom").emit("collisionObstacle", collisionResult.data);

      console.log("충돌한 장애물 정보:", collisionResult.id);

      if (collisionResult.id === "obstacle001") {
        // 상어와 충돌한 경우
        socket.emit("collisionShark");
        console.log(`${userId}가 상어와 충돌하여 사망했습니다.`);

        // 먼저 소켓을 gameRoom에서 제거
        socket.leave("gameRoom");

        // 플레이어를 Redis에서 제거
        const broadcastData = await removeUserData(userId);

        // 제거한 후, 남은 플레이어들에게 업데이트된 캐릭터 위치를 브로드캐스트
        io.to("gameRoom").emit("updateCharacterPosition", broadcastData);

        // 플레이어의 게임 데이터를 초기화
        socket.emit("updateCharacterPosition", []);
        socket.emit("generateRandomTrash", []);
        socket.emit("generateRandomObstacle", []);
        socket.emit("generateRandomItem", []);
      } else if (collisionResult.id === "obstacle002") {
        // 해파리와 충돌한 경우
        socket.emit("collisionJellyfish");
        console.log(`${userId}가 해파리에 쏘여 어지러워집니다.`);
      } else {
        console.log(`${userId}가 미확인 수중 물체와 충돌했습니다! USO`);
      }
    }

    // gameRoom 방 전체에 브로드캐스트
    io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
  });
};
