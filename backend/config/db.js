// config/db.js
require("dotenv").config(); // .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)
const mongoose = require("mongoose");
const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});
const subscriber = redisClient.duplicate(); // redis 구독용 클라이언트

redisClient.on("error", (err) => console.error("Redis 오류:", err));
subscriber.on("error", (err) => console.error("Redis 구독 오류:", err));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB에 연결되었습니다.");

    await redisClient.connect();
    await subscriber.connect();
    console.log("Redis에 연결되었습니다.");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // 실패 시 프로세스 종료
  }
};

module.exports = { connectDB, redisClient, subscriber };
