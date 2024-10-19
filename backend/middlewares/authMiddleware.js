// middlewares/authMiddleware.js

require("dotenv").config();
// .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)

const jwt = require("jsonwebtoken");

// 이걸 넘겨준 엔드포인트는 인증된 사용자만 접근할 수 있음
// auth 미들웨어가 먼저 실행되어 인증 과정을 처리함
// 전후처리를 해줌. 지금은 토큰 인증하고 토큰이 유효한지 검증

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ msg: "토큰이 없습니다. 인증이 거부되었습니다." });
  }

  // 토큰이 있다면, isAdmin 여부로 admin이나 login 페이지로 보내주자.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 열려라 참깨
   // req.user = { id: decoded.userId };

   const user = await User.findById(decoded.userId); // 사용자 정보를 DB에서 찾기
    if (!user) { // 예외처리 추가
      return res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user; // 요청 객체에 사용자 정보 추가

    if (user.isAdmin) { // isAdmin : TRUE
      return next(); // admin 페이지로
    }     
    else { // isAdmin : FALSE
      return next(); // 개인 페이지로
    }
  } 
  catch (err) {
    res.status(401).json({ msg: "유효하지 않은 토큰입니다." });
  }
};