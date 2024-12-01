// backend/utils/trashUtils.js

const { redisClient } = require("../config/db");

// 새로 생성한 쓰레기를 Redis에 저장
exports.updateTrashPositions = async (objectId, trashId, position) => {
  const newTrash = { objectId, trashId, position };
  // 직렬화해서 Redis에 저장
  await redisClient.lPush("trashPositions", JSON.stringify(newTrash));
  return true;
};

// 전체 쓰레기 데이터 리턴
exports.getTrashPositions = async () => {
  // 전체 쓰레기 리스트 반환
  // redisClient.lRange(key, start, stop) 메서드를 사용하여,리스트를 가져옴
  // 매개변수 0은 시작, -1은 끝을 의미함.
  const trashList = await redisClient.lRange("trashPositions", 0, -1);

  // 아이템 개별로 파싱해서 값 리턴
  return trashList.map((item) => JSON.parse(item));
};

// 특정 쓰레기를 Redis에서 제거하는 함수
exports.removeTrashPosition = async (objectId) => {
  const trashList = await redisClient.lRange("trashPositions", 0, -1);

  for (let trash of trashList) {
    const parsedTrash = JSON.parse(trash);
    if (parsedTrash.objectId === objectId) {
      await redisClient.lRem("trashPositions", 1, trash);
      // console.log(`쓰레기 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
};
