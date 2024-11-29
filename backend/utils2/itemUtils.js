// backend/utils/itemUtils.js

const { redisClient } = require("../config/db");

// 새로 생성한 아이템(게임 맵에 떠있는)을 Redis에 저장
exports.updateItemPositions = async (objectId, itemId, image, position) => {
  const newItem = { objectId, itemId, image, position }; // 이미지명도 추가
  await redisClient.lPush("itemPositions", JSON.stringify(newItem));
  return true;
};

// 전체 아이템(게임 맵에 떠있는) 데이터 리턴
exports.getItemPositions = async () => {
  const itemList = await redisClient.lRange("itemPositions", 0, -1);
  return itemList.map((item) => JSON.parse(item));
};

// 특정 아이템을 Redis에서 제거하는 함수
exports.removeItemPosition = async (objectId) => {
  const itemList = await redisClient.lRange("itemPositions", 0, -1);

  for (let item of itemList) {
    const parsedItem = JSON.parse(item);
    if (parsedItem.objectId === objectId) {
      await redisClient.lRem("itemPositions", 1, item);
      // console.log(`아이템 ${objectId}가 제거되었습니다.`);
      return true;
    }
  }
  return false;
};
