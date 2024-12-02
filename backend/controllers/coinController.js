// controllers/coinController.js

const User = require("../models/user");

exports.getMyCoin = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ coin: user.coin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// FE 개발 편의를 위해 임의로 구현한 API, 추후 반드시 제거!
// exports.testIncCoin = async (req, res) => {
//   const userId = req.user._id;
//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
//     }
//     user.coin += 1000;
//     await user.save();
//     return res.status(200).json({ message: "정상적으로 코인 증가" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("서버 오류");
//   }
// };
