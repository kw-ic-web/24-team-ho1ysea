// backend/sockets/eventHandler/gameEvents.js

const { redisClient, subscriber } = require("../../config/db");
const {
  getUserTrashData,
  generateTrash,
  generateObstacle,
  generateItem,
} = require("../../utils/gameUtils");

const MAX_OBSTACLE = 20;
const MAX_ITEMS = 8;

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
exports.generateRandomTrash = async (io) => {
  let trashSpeed = Number(await redisClient.get("trashGenerationSpeed")); // 쓰레기 생성속도 redis에서 가져와서 기억
  let trashLimit = Number(await redisClient.get("trashGenerationLimit")); // 쓰레기 최대치 redis에서 가져와서 기억
  let intervalId = null; // interval 이벤트를 지우고 새로 생성하기 위해 필요

  // 클로저 활용! 해당 함수를 한 번 실행시키면 기존 이벤트를 지우고 새 이벤트를 등록한다.
  const startTrashGeneration = () => {
    // 해당 함수가 실행되었을 때, intervalId가 존재하면 이벤트 제거 후 재등록
    if (intervalId) clearInterval(intervalId);
    console.log("쓰레기 생성을 시작합니다...");

    intervalId = setInterval(async () => {
      const trashData = await generateTrash();

      // 쓰레기 최대치 도달 시 생성 X
      if (trashData.length > trashLimit) {
        console.log("쓰레기가 꽉 찼습니다.");
        return;
      }

      io.to("gameRoom").emit("generateRandomTrash", trashData); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
      console.log("쓰레기 생성 이벤트 실행!");
    }, trashSpeed * 1000);
  };

  // 쓰레기 생성 이벤트 시작
  startTrashGeneration();

  // Redis subscriber로 쓰레기 생성 속도 변경을 감지하면, 값을 업데이트하고 interval 이벤트 재등록
  subscriber.subscribe("trashGenerationSpeed", (newSpeed) => {
    trashSpeed = Number(newSpeed);
    console.log(`쓰레기 생성 속도 업데이트: ${trashSpeed}`);
    startTrashGeneration();
  });

  // Redis subscriber로 쓰레기 최대치 변경을 감지하면, 값을 업데이트하고 interval 이벤트 재등록
  subscriber.subscribe("trashGenerationLimit", (limit) => {
    trashLimit = Number(limit);
    console.log(`쓰레기 최대치 업데이트: ${trashLimit}`);
    startTrashGeneration();
  });
};

// 방해요소 랜덤 생성 이벤트
exports.generateRandomObstacle = (io) => {
  console.log("방해요소 생성을 시작합니다...");
  setInterval(async () => {
    const obstacleData = await generateObstacle();
    // 최대치 도달 시 생성 X
    if (obstacleData.length > MAX_OBSTACLE) {
      console.log("방해요소가 꽉 찼습니다.");
      return;
    }
    io.to("gameRoom").emit("generateRandomObstacle", obstacleData); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
    console.log("방해요소 생성 이벤트 실행!");
  }, 10000);
};

// 아이템 랜덤 생성 이벤트
exports.generateRandomItem = (io) => {
  console.log("아이템 생성을 시작합니다...");
  setInterval(async () => {
    const itemData = await generateItem();
    // 최대치 도달 시 생성 X
    if (itemData.length > MAX_ITEMS) {
      console.log("아이템이 꽉 찼습니다.");
      return;
    }
    io.to("gameRoom").emit("generateRandomItem", itemData);
    console.log("아이템 생성 이벤트 실행!");
  }, 15000);
};
