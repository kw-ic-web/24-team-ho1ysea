// controllers/coinController.js

const User = require("../models/User");

exports.getMyCoin = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({id : userId});

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({ coin: user.coin });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};
