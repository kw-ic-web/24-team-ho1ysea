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

// 라우트 설정
// 앞으로 라우트를 추가할 예정
app.use('/api/user', require('./routes/user'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));