// middlewares/validateApiKey.js

const dotenv = require("dotenv");
dotenv.config();

const validateApiKey = (req, res, next) => {
  const providedKey = req.headers["x-api-key"];

  if (!providedKey) {
    return res.status(400).json({ message: "API 키가 제공되지 않았습니다." });
  }

  if (providedKey !== process.env.UPDATE_API_KEY) {
    return res.status(403).json({ message: "유효하지 않은 API 키입니다." });
  }

  next();
};

module.exports = validateApiKey;
