// middlewares/authMiddleware.js

require('dotenv').config(); 
// .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)

const jwt = require('jsonwebtoken');

// 이걸 넘겨준 엔드포인트는 인증된 사용자만 접근할 수 있음
// auth 미들웨어가 먼저 실행되어 인증 과정을 처리함
// 전후처리를 해줌. 지금은 토큰 인증하고 토큰이 유효한지 검증

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: '토큰이 없습니다. 인증이 거부되었습니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId }; 
    next();
  } catch (err) {
    res.status(401).json({ msg: '유효하지 않은 토큰입니다.' });
  }
};