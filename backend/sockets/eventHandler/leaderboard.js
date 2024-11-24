const { subscriber } = require("../../config/db");

/**
 * @description 특정 유저의 trashAmount가 변경되면, 모든 클라이언트의 리더보드 데이터를 새로고침
 */
exports.leaderboard = (io) => {
  subscriber.subscribe("leaderboard", (userTrashData) => {
    const topUsers = Object.entries(JSON.parse(userTrashData))
      .map(([userId, trashAmount]) => ({
        userId,
        trashAmount: parseFloat(trashAmount) || 0, // 기본값 0
      }))
      .sort((a, b) => b.trashAmount - a.trashAmount) // 쓰레기량 내림차순 정렬
      .slice(0, 5); // 상위 5명

    io.emit("getLeaderBoard", topUsers);
  });
};
