// middlewares/adminMiddleware.js

module.exports = function (req, res, next) {
    // 사용자 객체가 있는지, 그리고 관리자 권한이 있는지 확인
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "관리자 권한이 필요합니다." });
    }
  
    next(); // 관리자 권한 확인 후 다음 미들웨어로 이동
  };
  