// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// 회원가입 함수
exports.signupUser = async (req, res) => {
    const { id, nickName, pw } = req.body;
  
    try {
      // 아이디 중복 체크
      let user = await User.findOne({ id });
      if (user) {
        return res.status(400).json({ msg: '이미 사용 중인 아이디입니다.' });
      }
  
      // 닉네임 중복 체크
      user = await User.findOne({ nickName });
      if (user) {
        return res.status(400).json({ msg: '이미 사용 중인 닉네임입니다.' });
      }
  
      // 새로운 유저 생성
      user = new User({ id, nickName, pw });
  
      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      user.pw = await bcrypt.hash(pw, salt);
  
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
    const { id, pw } = req.body;
  
    try {
      // 유저 확인
      const user = await User.findOne({ id });
      if (!user) {
        return res.status(400).json({ msg: '아이디 또는 비밀번호가 잘못되었습니다.' });
      }
  
      // 비밀번호 확인
      const isMatch = await bcrypt.compare(pw, user.pw);
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
