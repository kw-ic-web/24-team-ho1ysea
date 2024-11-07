// models/obstacle.js

const mongoose = require("mongoose");

const obstacleSchema = new mongoose.Schema({
  obstacleId: { type: String, required: true, unique: true }, // 방해요소 아이디
  obstacleName: { type: String, required: true }, // 방해요소 이름
  description: { type: String }, // 설명
  image: { type: String, required: true }, // S3 주소 (필수 아님) <- S3 주소 대신 이미지 이름을 반환하도록 수정 <- 필수로 변경할게요 : 현성
});

module.exports = mongoose.model("Obstacle", obstacleSchema);
