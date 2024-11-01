const { Server } = require("socket.io");

module.exports = socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("사용자 연결:", socket.id);

    // 여기에 각 소켓 컨트롤러 함수들을 넣어주면 될듯

    socket.on("disconnect", () => {
      console.log("사용자 연결 해제:", socket.id);
    });
  });
};
