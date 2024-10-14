// controllers/itemController.js
const Inventory = require('../models/inventory'); // 인벤토리 모델
const Item = require('../models/item'); // 아이템 모델
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어

// 보유 아이템 조회 함수
exports.getUserInventory = async (req, res) => {
    try {
        const userId = req.user.id; // 인증된 사용자의 ID 가져오기

        // 사용자의 인벤토리 조회
        const inventory = await Inventory.findOne({ userId }).populate('items.itemId');

        // 인벤토리에서 아이템 정보 추출
        if (!inventory || inventory.items.length === 0) {
            return res.status(404).json({ message: "No items found in inventory." });
        }

        const items = inventory.items.map(item => ({
            itemId: item.itemId._id,
            itemName: item.itemId.name, // 아이템 모델에 name 필드가 있다고 가정
            quantity: item.quantity,
            description: item.itemId.description // 아이템 모델에 description 필드가 있다고 가정
        }));

        return res.json(items);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
