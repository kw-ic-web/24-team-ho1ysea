// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config(); 
// .env 파일의 내용을 로드 (cf. '.env' 내용 참조하는 파일들은 명시 필요)


// 회원가입 함수
exports.signupUser = async (req, res) => {
    const { id, userName, password, nickName } = req.body;
  
    try {
      // 아이디 중복 체크
      let user = await User.findOne({ id });
      if (user) {
        return res.status(400).json({ msg: '이미 사용 중인 아이디입니다.' });
      }
  
      // 사용자 이름 중복 체크
      user = await User.findOne({ userName });
      if (user) {
        return res.status(400).json({ msg: '사용자 이름이 이미 존재합니다.' });
      }

       // 닉네임 중복 체크
       user = await User.findOne({ nickName });
       if (user) {
         return res.status(400).json({ msg: '닉네임이 이미 존재합니다.' });
       }
  
      // 새로운 유저 생성
      user = new User({ id, userName, password, nickName });
  
      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      // 유저 저장
      await user.save();
  
      res.status(201).json({ message: '회원가입이 완료되었습니다.', userId: user._id });
    } catch (err) {
      console.error(err.message); 
      res.status(500).send('서버 오류');
    }
  };
  
  // 로그인 함수
  exports.loginUser = async (req, res) => {
    const { id, password } = req.body;
  
    try {
      // 유저 확인
      const user = await User.findOne({ id });
      if (!user) {
        return res.status(400).json({ msg: '아이디 또는 비밀번호가 잘못되었습니다.' });
      }
  
      // 비밀번호 확인
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: '아이디 또는 비밀번호가 잘못되었습니다.' });
      }
  
      // JWT 토큰 발급
      const payload = { userId: user._id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token, userId: user._id });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('서버 오류');
    }
  };
// 사용자 정보 조회 함수
exports.getUserInfo = async (req, res) => {
  try {
      const userId = req.user; // authMiddleware를 거친 상태
      const user = await User.findById(userId); // userId로 사용자 조회

      if (!user) {
          return res.status(404).json({ msg: '사용자를 찾을 수 없습니다.' });
      }

      // 필요한 정보 반환
      res.json({
          username: user.userName,  // 사용자 이름
          playCount: user.countPlay, // 플레이 횟수
          nickname: user.nickName,   // 닉네임
          id: user.id                // id 사용 : 여기 원래 이메일이었는데 value가 같아서
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('서버 오류');
  }
};