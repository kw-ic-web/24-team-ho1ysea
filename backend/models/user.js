const mongoose = require('mongoose');

// 사용자 스키마 설계
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
<<<<<<< HEAD
    pw: { type: String, required: true }, 
=======
    pw: { type: String, required: true, set: encryptPassword },  // 저장 시 암호화
>>>>>>> 3680101c4db6e81b5f8c9755845b43c145a5a099
    nickName: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },  // 기본값 false
    topRate: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    countPlay: { type: Number, default: 0 }
});

// 사용자 모델 생성
const User = mongoose.model('User', userSchema);

// 내보내기
module.exports = User;