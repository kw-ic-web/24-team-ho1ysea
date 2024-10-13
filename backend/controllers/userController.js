// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Report = require('../models/report');

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
      const userId = req.user.id; // authMiddleware를 거친 상태
      const user = await User.findById(userId); // userId로 사용자 조회

      if (!user) {
          return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      // 필요한 정보 반환
      res.json({
          userName: user.userName,  // 사용자 이름
          playCount: user.countPlay, // 플레이 횟수
          nickName: user.nickName,   // 닉네임
          id: user.id                // id 사용 : 여기 원래 이메일이었는데 value가 같아서
      });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('서버 오류');
  }
};

// 사용자 정보 수정 함수
exports.updateUserInfo = async (req, res) => {
  const userId = req.user.id; // authMiddleware를 통해 사용자 ID를 가져옴
  const { nickName, password } = req.body;

  try {
    const updates = {};

    // 닉네임 업데이트 시 중복 체크
    if (nickName) {
      const existingUser = await User.findOne({ nickName: nickName });
      if (existingUser) {
        return res.status(400).json({ msg: '이미 존재하는 닉네임입니다.' });
      }
      updates.nickName = nickName; // 닉네임 업데이트
    }

    // 비밀번호 업데이트
    if (password) {
      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt); // 비밀번호 업데이트
    }

    // 사용자 정보 업데이트
    await User.findByIdAndUpdate(userId, updates, { new: true });

    res.json({ msg: 'User information updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
  }
};
// 후에 예외처리 추가가 필요할 것 같다(ex. 비번이 너무 짧거나, 특수문자 미포함)


// 닉네임 중복 체크 함수
exports.checkNicknameAvailability = async (req, res) => {
  const { nickName } = req.query;

  try {
    const existingUser = await User.findOne({ nickName: nickName });

  // 닉네임이 존재할 경우
  if (existingUser) {
    return res.json({ isAvailable: false }); // 중복된 닉네임
  }

  // 닉네임이 존재하지 않을 경우
    res.json({ isAvailable: true });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
  }
};

// 아이디 중복 체크 함수
exports.checkIdAvailability = async (req, res) => {
  const { id } = req.query; // 쿼리 파라미터에서 id 가져오기

  try {
    const existingUser = await User.findOne({ id: id });

    // 아이디가 존재할 경우
    if (existingUser) {
      return res.json({ isAvailable: false }); // 중복된 아이디
    }

    // 아이디가 존재하지 않을 경우
    res.json({ isAvailable: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
  }
};

exports.createReport = async (req, res) => {
  const { reportedUserId, reason } = req.body;
  const reporterId = req.user.id;  // authMiddleware를 통해 가져온 사용자 ID

  try {
    // 입력 값 확인
    if (!reportedUserId || !reason) {
      return res.status(400).json({ msg: '모든 필드를 입력해주세요.' });
    }
    

    // 신고할 유저가 존재하는지 확인
    const reportedUser = await User.findOne({ id: reportedUserId });
    if (!reportedUser) {
      return res.status(404).json({ msg: '신고할 사용자를 찾을 수 없습니다.' });
    }


    // 자신을 신고하는지 체크
    if (reporterId === reportedUserId) {
      return res.status(400).json({ msg: '자기 자신을 신고할 수 없습니다.' });
    }
    // 신고 생성
    const newReport = new Report({
      reporterId,
      reportedUserId,
      reason,
    });

    await newReport.save();
    res.status(201).json({ message: '신고가 성공적으로 제출되었습니다.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
  }
};
exports.scheduleAccountCancellation = async (req, res) => {
  const userId = req.user; // authMiddleware를 통해 사용자 ID를 가져옴

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: '사용자를 찾을 수 없습니다.' });
    }

    // 상태를 "withdrawalPlanned"으로 업데이트
    user.status = 'withdrawnPlanned';
    await user.save();

    res.json({ message: '탈퇴 예약이 완료되었습니다.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('서버 오류');
  }
};

/* 
{"message": "탈퇴를 예약합니다."}  
  --> API 테스트할 때 body에 이거 넣어주면 탈퇴 예약 메시지 뜨긴 해요

  ↓↓↓↓↓↓↓↓ 아래는 탈퇴 처리함수인데 이것도 판단 부탁 ↓↓↓↓↓↓↓↓↓↓↓↓↓
*/


// // 실제 탈퇴 처리 함수 (이 함수는 예약된 사용자를 대상으로 하여 주기적으로 호출됨 -> 매일 자정마다)
// exports.processAccountCancellation = async () => {
//   try {
//     const usersToWithdraw = await User.find({ status: 'withdrawnPlanned' });

//     // 탈퇴된 사용자 처리 (예: 데이터 삭제)
//     for (const user of usersToWithdraw) {
//       user.status = 'withdrawn'; // 상태 변경
//       await user.save();
//       // 필요시 사용자 삭제: await User.findByIdAndDelete(user._id);
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// };
