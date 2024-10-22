// controllers/storeController.js

const User = require("../models/User");
const Item = require("../models/item");
const Inventory = require("../models/inventory");

// trash -> coin 환전
exports.exchangeTrash = async (req, res) => {
  const { trashAmount } = req.body; // 환전할 쓰레기 수량
  const userId = req.user._id; // 인증 미들웨어에서 설정한 사용자 ID

  try {
    // 유저 정보 가져오기
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 쓰레기 수량 확인
    if (user.trash < trashAmount) {
      return res
        .status(400)
        .json({ message: "환전할 쓰레기 수량이 부족합니다." });
    }

    // 환전 비율 (예시로 1:1 비율로 설정)
    const exchangeRate = 1;
    const exchangedGold = trashAmount * exchangeRate;

    // 쓰레기 차감 및 골드 추가
    user.trash -= trashAmount;
    user.coin += exchangedGold;

    await user.save();

    res.json({
      exchangedGold, // 환전된 금화 양
      totalGold: user.coin, // 총 보유 금화량
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// get store Items - 차별화 둘지 생각필요
exports.getStoreItems = async (req, res) => {
  try {
    const items = await Item.find();

    // 응답 형식에 맞게 데이터 매핑
    const responseItems = items.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      image: item.image, // image 필드 추가했습니다 : 현성
      description: item.description,
      price: item.cost, // 'cost' 필드를 'price'로 변경하여 반환
    }));

    res.json(responseItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// 아이템 구매
exports.buyItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const item = await Item.findOne({ itemId });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    const totalCost = item.cost * quantity;

    if (user.coin < totalCost) {
      return res.status(400).json({ message: "코인이 부족합니다." });
    }

    // 코인 차감
    user.coin -= totalCost;
    await user.save();

    // 인벤토리 업데이트
    let inventory = await Inventory.findOne({ userid: userId });

    if (!inventory) {
      // 인벤토리가 없으면 생성
      inventory = new Inventory({ userid: userId, items: [] });
    }

    // 아이템이 이미 있는지 확인
    const itemIndex = inventory.items.findIndex(
      (invItem) => invItem.itemId === itemId
    );

    if (itemIndex > -1) {
      // 이미 아이템이 있으면 수량 증가
      inventory.items[itemIndex].quantity += quantity;
    } else {
      // 아이템이 없으면 추가
      inventory.items.push({ itemId, quantity });
    }

    await inventory.save();

    res.json({ message: "아이템 구매 성공" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// 아이템 판매
exports.sellItem = async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const item = await Item.findOne({ itemId });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 인벤토리에서 아이템 확인
    const inventory = await Inventory.findOne({ userid: userId });

    if (!inventory) {
      return res.status(400).json({ message: "판매할 아이템이 없습니다." });
    }

    const itemIndex = inventory.items.findIndex(
      (invItem) => invItem.itemId === itemId
    );

    if (itemIndex === -1 || inventory.items[itemIndex].quantity < quantity) {
      return res
        .status(400)
        .json({ message: "판매할 아이템의 수량이 부족합니다." });
    }

    // 아이템 수량 감소
    inventory.items[itemIndex].quantity -= quantity;

    if (inventory.items[itemIndex].quantity === 0) {
      // 수량이 0이면 아이템 제거
      inventory.items.splice(itemIndex, 1);
    }

    await inventory.save();

    // 판매 가격 계산 (예: 아이템 가격의 100% -> 추후 조절 가능!)
    const sellPrice = item.cost * 1.0 * quantity;
    user.coin += sellPrice;
    await user.save();

    res.json({
      exchangedGold: sellPrice, // 판매로 얻은 금화 양
      totalGold: user.coin, // 총 보유 금화량
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};
