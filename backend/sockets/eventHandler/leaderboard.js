const { subscriber } = require("../../config/db");
const { makeLeaderBoard } = require("../../utils/makeLeaderBoard");

/**
 * @description 특정 유저의 trashAmount가 변경되면, 모든 클라이언트의 리더보드 데이터를 새로고침
 */
exports.leaderboard = (io) => {
  subscriber.subscribe("leaderboard", async (userTrashData) => {
    const topUsers = await makeLeaderBoard(JSON.parse(userTrashData));

    io.emit("getLeaderBoard", topUsers);
  });
};
