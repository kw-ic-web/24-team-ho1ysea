db = db.getSiblingDB("ocean-game");

db.items.insertMany([
  {
    _id: ObjectId("67170185370f90e1c971297c"),
    itemId: "item001",
    itemName: "그물",
    image: "net.png",
    description: "더 멀리있는 쓰레기를 주울 수 있다!",
    cost: 200,
  },
  {
    _id: ObjectId("671701e6370f90e1c971297d"),
    itemId: "item002",
    itemName: "물갈퀴",
    image: "flipper.png",
    description: "이동속도가 소폭 상승한다!",
    cost: 400,
  },
  {
    _id: ObjectId("67170212370f90e1c971297e"),
    itemId: "item003",
    itemName: "잠수복",
    image: "wetsuit.png",
    description: "더 오래 바다에 있을 수 있다!",
    cost: 600,
  },
  {
    _id: ObjectId("67170247370f90e1c971297f"),
    itemId: "item004",
    itemName: "뜰채",
    image: "dipNet.png",
    description: "더 효율적으로 쓰레기를 주울 수 있다!",
    cost: 100,
  },
]);

db.trash.insertMany([
  {
    _id: ObjectId("672ce6faa31b23fedcdf08f8"),
    trashId: "trash001",
    trashName: "플라스틱 병",
    description: "재활용 가능한 플라스틱 병입니다.",
    trashAmount: 2,
    image: "plastic_bottle.png",
  },
  {
    _id: ObjectId("672ce704a31b23fedcdf08f9"),
    trashId: "trash002",
    trashName: "신문지",
    description: "재활용 가능한 신문지입니다.",
    trashAmount: 1,
    image: "newspaper.png",
  },
]);

db.obstacles.insertMany([
  {
    obstacleId: "obstacle001",
    obstacleName: "상어",
    description: "마주치면 죽습니다. 조심하세요.",
    image: "shark.png",
  },
  {
    obstacleId: "obstacle002",
    obstacleName: "해파리",
    description: "쏘이면 어지럽습니다~",
    image: "jellyfish.png",
  },
]);

db.users.insertOne({
  id: "admin",
  password: "$2a$10$RMquu0zGHm.Da/CVZZ1bJOMYwAobwWKd4HYcqkfxBXyekPkkjmMqa",
  nickName: "admin",
  isAdmin: true,
  topRate: 0,
  coin: 0,
  countPlay: 0,
  status: "active",
  __v: 0,
});
