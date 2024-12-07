// backend/sockets/eventHandler/playerMove.js

const {
  BASE_SPEED,
  BASE_RANGE,
  COLLISION_JELLYFISH_DURATION,
} = require("../../config/constant");
const { checkCollision } = require("../../utils/gameUtils");
const {
  updateUserData,
  removeUserData,
  removeUserTrashAmount,
  updateUserTrashAmount,
} = require("../../utils/redisHandler");

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
      const itemId = collisionResult.id;
      const objectId = collisionResult.objectId;

      // 이전에 처리한 아이템인지 검사
      if (
        socket.data.lastProcessedItemId && // null이 아니고
        socket.data.lastProcessedItemId === objectId // 현재 충돌값과 일치하면
      ) {
        // 이미 처리한 아이템이면 무시
        console.log("중복 아이템 처리 요청 무시:", itemId);
      } else {
        // 처음 처리하는 아이템이면 기록
        socket.data.lastProcessedItemId = objectId;

        io.to("gameRoom").emit("collisionItem", collisionResult.data);
        console.log("충돌한 아이템 정보:", itemId);
        socket.emit("getItem", itemId);
      }
    } else if (collisionResult && collisionResult.type === "obstacle") {
      console.log("충돌한 장애물 정보:", collisionResult.id);
      const obstacleId = collisionResult.id;
      const objectId = collisionResult.objectId;

      // 이전에 처리한 방해요소인지 검사 (아이템과 동일하게 처리)
      if (
        socket.data.lastProcessedObstacleId && // null이 아니고
        socket.data.lastProcessedObstacleId === objectId // 현재 충돌값과 일치하면
      ) {
        // 이미 처리한 방해요소면 무시
        console.log("중복 방해요소 처리 요청 무시:", obstacleId);
      } else {
        // 처음 처리하는 방해요소이면 기록
        socket.data.lastProcessedObstacleId = objectId;

        if (obstacleId === "obstacle001") {
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
          // 해당 플레이어의 보유 쓰레기 제거 -> pub -> sub이 받아서 leaderboard 이벤트를 소켓으로 쏨
          await removeUserTrashAmount(userId);
          // 이동속도, 사거리 초기화
          socket.emit("getPlayerSpeed", BASE_SPEED);
          socket.emit("getPlayerRange", BASE_RANGE);
        } else if (obstacleId === "obstacle002") {
          // 해파리와 충돌한 경우
          socket.emit("collisionJellyfish", COLLISION_JELLYFISH_DURATION);
          console.log(`${userId}가 해파리에 쏘여 어지러워집니다.`);
        } else {
          console.log(`${userId}가 미확인 수중 물체와 충돌했습니다! USO`);
        }
      }
    }

    // gameRoom 방 전체에 브로드캐스트
    io.to("gameRoom").emit("updateCharacterPosition", broadcastData);
  });
};
