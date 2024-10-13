// middlewares/authMiddleware.js

require('dotenv').config(); 
// .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)

const jwt = require('jsonwebtoken');

// 이걸 넘겨준 엔드포인트는 인증된 사용자만 접근할 수 있음
// auth 미들웨어가 먼저 실행되어 인증 과정을 처리함
// 전후처리를 해줌. 지금은 토큰 인증하고 토큰이 유효한지 검증

// 인증된 사용자만 접근할 수 있는 미들웨어
module.exports = function (req, res, next) {
  // Authorization 헤더에서 토큰 추출
  const authHeader = req.header('Authorization');
  
  // 토큰 유무 및 형식 검사
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: '유효하지 않은 인증 형식입니다.' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer " 이후의 토큰만 추출

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.user = decoded.userId; // 토큰이 유효하면 사용자 ID를 req.user에 저장
    next(); // 다음 미들웨어로 넘김
  } catch (err) {
    // 토큰 만료 시와 기타 검증 오류를 구분하여 처리
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: '토큰이 만료되었습니다.' });
    } else {
      return res.status(401).json({ msg: '유효하지 않은 토큰입니다.' });
    }
  }
};