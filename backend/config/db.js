// config/db.js
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
