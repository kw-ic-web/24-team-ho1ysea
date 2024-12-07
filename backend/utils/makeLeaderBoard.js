const User = require("../models/user");

// 데이터 정렬 및 상위 5명 추출
exports.makeLeaderBoard = async (userTrashData) => {
  // 현재 플레이 중인 유저들의 닉네임 추출 목적
  const userIds = Object.keys(userTrashData);
  const users = await User.find({ id: { $in: userIds } });

  const topUsers = users
    .map((user) => ({
      userId: user.id,
      nickName: user.nickName,
      trashAmount: parseFloat(userTrashData[user.id] || 0),
    }))
    .sort((a, b) => b.trashAmount - a.trashAmount) // 쓰레기량 내림차순 정렬
    .slice(0, 5); // 상위 5명

  return topUsers;
};
