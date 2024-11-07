// models/trash.js

const mongoose = require("mongoose");

const trashSchema = new mongoose.Schema({
  trashId: { type: String, required: true, unique: true }, // 쓰레기 아이디
  trashName: { type: String, required: true }, // 쓰레기 이름
  description: { type: String }, // 설명
  trashAmount: { type: Number, required: true }, // 쓰레기 양
  image: { type: String, required: true }, // S3 주소 (필수 아님) <- S3 주소 대신 이미지 이름을 반환하도록 수정 <- 필수로 변경할게요 : 현성
});

module.exports = mongoose.model("Trash", trashSchema, "trash"); // 이름 지정안하면 trashes가 됨...
