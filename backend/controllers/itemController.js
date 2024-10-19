// controllers/itemController.js
const Inventory = require("../models/inventory");
const Item = require("../models/item");

// 보유 아이템 조회
exports.getUserInventory = async (req, res) => {
  const userId = req.user._id;

  try {
    // 사용자의 인벤토리 가져오기
    const inventory = await Inventory.findOne({ userid: userId });

    if (!inventory || inventory.items.length === 0) {
      return res.status(200).json([]); // 빈 배열 반환
    }

    // 아이템 상세 정보 가져오기
    const inventoryItems = await Promise.all(
      inventory.items.map(async (invItem) => {
        const item = await Item.findOne({ itemId: invItem.itemId });

        if (!item) {
          return null; // 아이템이 없을 경우 null 반환
        }

        return {
          itemId: item.itemId,
          itemName: item.itemName,
          quantity: invItem.quantity,
          image: item.image,
          description: item.description,
        };
      })
    );

    // null 값 제거
    const responseItems = inventoryItems.filter((item) => item !== null);

    res.json(responseItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// 모든 아이템 설명 조회
exports.getAllItemDescriptions = async (req, res) => {
  try {
    const items = await Item.find();

    const responseItems = items.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      image: item.image,
      description: item.description,
    }));

    res.json(responseItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// 아이템 사용
exports.useItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;

  try {
    // 인벤토리에서 아이템 확인
    const inventory = await Inventory.findOne({ userid: userId });

    if (!inventory) {
      return res.status(400).json({ message: "사용할 아이템이 없습니다." });
    }

    const itemIndex = inventory.items.findIndex(
      (invItem) => invItem.itemId === itemId
    );

    if (itemIndex === -1 || inventory.items[itemIndex].quantity < 1) {
      return res.status(400).json({ message: "아이템의 수량이 부족합니다." });
    }

    // 아이템 수량 감소
    inventory.items[itemIndex].quantity -= 1;

    // 수량이 0이면 아이템 제거
    if (inventory.items[itemIndex].quantity === 0) {
      inventory.items.splice(itemIndex, 1);
    }

    await inventory.save();

    res.json({
      message: "아이템 사용 성공",
      id: itemId,
      quantity:
        inventory.items[itemIndex]?.quantity !== undefined
          ? inventory.items[itemIndex].quantity
          : 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};

// 아이템 습득
exports.addItem = async (req, res) => {
  const userId = req.user.id;
  const { itemId } = req.body;

  try {
    // 아이템 존재 여부 확인
    const item = await Item.findOne({ itemId });

    if (!item) {
      return res.status(404).json({ message: "아이템을 찾을 수 없습니다." });
    }

    // 인벤토리 가져오기 또는 생성
    let inventory = await Inventory.findOne({ userid: userId });

    if (!inventory) {
      inventory = new Inventory({ userid: userId, items: [] });
    }

    // 아이템이 이미 있는지 확인
    const itemIndex = inventory.items.findIndex(
      (invItem) => invItem.itemId === itemId
    );

    if (itemIndex > -1) {
      // 이미 아이템이 있으면 수량 증가
      inventory.items[itemIndex].quantity += 1;
    } else {
      // 아이템이 없으면 추가
      inventory.items.push({ itemId, quantity: 1 });
    }

    await inventory.save();

    res.json({
      message: "아이템 추가 성공",
      id: itemId,
      quantity:
        inventory.items[itemIndex > -1 ? itemIndex : inventory.items.length - 1]
          .quantity,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("서버 오류");
  }
};
