// models/inventory.js


const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  userid: { type: String, ref: "User", required: true }, // 회원 데이터와 연결하는 ID
  items: [
    {
      itemId: { type: String, required: true }, // 아이템 아이디
      quantity: { type: Number, default: 1 }, // 수량
    },
  ],
});

module.exports = mongoose.model("Inventory", inventorySchema);

