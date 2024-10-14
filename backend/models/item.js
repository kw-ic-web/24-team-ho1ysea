// models/item.js
const mongoose = require('mongoose');

// 아이템 스키마 설계
const itemSchema = new mongoose.Schema({
    itemId: { type: String, required: true, unique: true }, // 아이템 아이디
    itemName: { type: String, required: true }, // 아이템 이름
    description: { type: String, required: true }, // 아이템 설명
    cost: { type: Number, required: true }, // 아이템 가격
    image: { type: String, required: true }, // S3 이미지 주소
});

// 아이템 모델 생성
const Item = mongoose.model('Item', itemSchema);

// 내보내기
module.exports = Item;
