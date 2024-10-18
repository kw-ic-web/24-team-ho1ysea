// models/item.js


const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true }, // 아이템 아이디
  itemName: { type: String, required: true }, // 아이템 이름
  description: { type: String }, // 설명
  cost: { type: Number, required: true }, // 가격
  image: { type: String }, // S3 주소 (필수 아님)
});

module.exports = mongoose.model("Item", itemSchema);

