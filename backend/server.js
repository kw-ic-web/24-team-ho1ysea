// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(require('cors')());

// 라우트 설정( 앞으로 라우트를 추가할 예정)
app.use('/api/user', require('./routes/userRoutes'));

// 매일 자정에 탈퇴 처리 함수 실행
// cron.schedule('0 0 * * *', userController.processAccountCancellation);   // 신기해서 넣어봤음(탈퇴처리 + 탈퇴예약 2가지 고려해야 함)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));