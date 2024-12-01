// 데이터 정렬 및 상위 5명 추출
exports.makeLeaderBoard = (userTrashData) => {
  const topUsers = Object.entries(userTrashData)
    .map(([userId, trashAmount]) => ({
      userId,
      trashAmount: parseFloat(trashAmount) || 0, // 기본값 0
    }))
    .sort((a, b) => b.trashAmount - a.trashAmount) // 쓰레기량 내림차순 정렬
    .slice(0, 5); // 상위 5명

  return topUsers;
};
