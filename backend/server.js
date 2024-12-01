// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./config/db");
const socketHandler = require("./sockets/socketHandler");

const app = express();

// 소켓 서버 초기 설정
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONT_URL, methods: ["GET", "POST"] },
});
socketHandler(io);

// MongoDB + Redis 연결
connectDB();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require("cors")());

// 라우트 설정( 앞으로 라우트를 추가할 예정)
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/store", require("./routes/storeRoutes"));
app.use("/api/coin", require("./routes/coinRoutes"));
app.use("/api/item", require("./routes/itemRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/game", require("./routes/gameRoutes"));

// 매일 자정에 탈퇴 처리 함수 실행
// cron.schedule('0 0 * * *', userController.processAccountCancellation);   // 신기해서 넣어봤음(탈퇴처리 + 탈퇴예약 2가지 고려해야 함)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`)
);
