// models/item.js

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // 아이템 아이디
  itemName: { type: String, required: true }, // 아이템 이름
  description: { type: String }, // 설명
  cost: { type: Number, required: true }, // 가격
  image: { type: String, required: true }, // S3 주소 (필수 아님) <- S3 주소 대신 이미지 이름을 반환하도록 수정 <- 필수로 변경할게요 : 현성
});

module.exports = mongoose.model("Item", itemSchema);
