// config/db.js
require('dotenv').config(); // .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB에 연결되었습니다.');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // 실패 시 프로세스 종료
  }
};

module.exports = connectDB;