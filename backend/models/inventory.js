// models/inventory.js
const mongoose = require('mongoose');

// 인벤토리 스키마 설계
const inventorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

// 인벤토리 모델 생성
const Inventory = mongoose.model('Inventory', inventorySchema);

// 내보내기
module.exports = Inventory;
