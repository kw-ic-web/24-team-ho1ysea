// backend/sockets/eventHandler/gameEvents.js

const { redisClient, subscriber } = require("../../config/db");
const {
  getUserTrashData,
  generateTrash,
  generateItem,
} = require("../../utils/gameUtils");
const {
  getObstaclePositions,
  updateObstaclePositions,
  removeObstaclePosition,
  updateObstacleStatus,
} = require("../../utils/redisHandler");
const Obstacle = require("../../models/obstacle");
const { v4: uuidv4 } = require("uuid");
const {
  MAX_OBSTACLE,
  MAX_ITEMS,
  TIMER_OBSTACLE_GENERATION,
  TIMER_ITEM_GENERATION,
  TIMER_OBSTACLE_ACTIVATION,
  TIMER_OBSTACLE_REMOVE,
} = require("../../config/constant");

const generateRandomPosition = () => {
  const px = 50;
  const py = 50;
  const w = 1280 - 2 * px;
  const h = 500 - 2 * py;

  return {
    x: Math.round(Math.random() * w) + px, // x 범위: 50 < x < 1230
    y: Math.round(Math.random() * h) + py, // y 범위: 50 < y < 450
  };
};

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
        // console.log("쓰레기가 꽉 찼습니다.");
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
    const obstacleCount = await Obstacle.countDocuments();

    if (obstacleCount === 0) {
      throw new Error("데이터베이스에 방해요소가 없습니다.");
    }

    // 랜덤 인덱스 생성
    const randomIndex = Math.floor(Math.random() * obstacleCount);

    // 랜덤한 방해요소 가져오기
    const randomObstacle = await Obstacle.findOne().skip(randomIndex).exec();

    const objectId = uuidv4();
    const obstacleId = randomObstacle.obstacleId; // Obstacle 모델의 obstacleId 필드 사용
    const position = generateRandomPosition();

    // Redis에 저장
    await updateObstaclePositions(objectId, obstacleId, position, 0);

    // 업데이트된 전체 방해요소 데이터 가져오기
    const obstacleList = await getObstaclePositions();

    // 최대치 도달 시 생성 X
    if (obstacleList.length > MAX_OBSTACLE) {
      console.log("방해요소가 꽉 찼습니다.");
      return;
    }
    io.to("gameRoom").emit("generateRandomObstacle", obstacleList); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
    // console.log("방해요소 생성 이벤트 실행!");

    setTimeout(async () => {
      await updateObstacleStatus(objectId, obstacleId, position);

      const obstacleList = await getObstaclePositions();

      io.to("gameRoom").emit("generateRandomObstacle", obstacleList); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
      // console.log("방해요소 상태 업데이트");

      // 3초후
      setTimeout(async () => {
        await removeObstaclePosition(objectId);

        const obstacleList = await getObstaclePositions();

        io.to("gameRoom").emit("generateRandomObstacle", obstacleList); // gameRoom 내의 모든 클라이언트에게 브로드캐스트
        // console.log("방해요소 상태 업데이트");
      }, TIMER_OBSTACLE_REMOVE);
    }, TIMER_OBSTACLE_ACTIVATION);
  }, TIMER_OBSTACLE_GENERATION);
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
    // console.log("아이템 생성 이벤트 실행!");
  }, TIMER_ITEM_GENERATION);
};
