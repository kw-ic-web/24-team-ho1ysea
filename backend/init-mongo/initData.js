// initData.js
const mongoose = require("mongoose");
const Item = require("../models/item");
const Trash = require("../models/trash");
const Obstacle = require("../models/obstacle");
const User = require("../models/user");

const initData = async () => {
  try {
    // Items 컬렉션 초기화
    const itemCount = await Item.countDocuments();
    if (itemCount === 0) {
      await Item.insertMany([
        {
          itemId: "item001",
          itemName: "그물",
          image: "net.png",
          description: "더 멀리 있는 쓰레기를 주울 수 있다!",
          cost: 200,
        },
        {
          itemId: "item002",
          itemName: "물갈퀴",
          image: "flipper.png",
          description: "이동 속도가 소폭 상승한다!",
          cost: 400,
        },
        {
          itemId: "item003",
          itemName: "잠수복",
          image: "wetsuit.png",
          description: "더 오래 바다에 있을 수 있다!",
          cost: 600,
        },
        {
          itemId: "item004",
          itemName: "뜰채",
          image: "dipNet.png",
          description: "더 효율적으로 쓰레기를 주울 수 있다!",
          cost: 100,
        },
      ]);
      console.log("Item 초기 데이터 삽입 완료");
    } else {
      console.log("Item 컬렉션에 이미 데이터가 존재합니다.");
    }

    // Trash 컬렉션 초기화
    const trashCount = await Trash.countDocuments();
    if (trashCount === 0) {
      await Trash.insertMany([
        {
          trashId: "trash001",
          trashName: "플라스틱 병",
          description: "재활용 가능한 플라스틱 병입니다.",
          trashAmount: 2,
          image: "plastic_bottle.png",
        },
        {
          trashId: "trash002",
          trashName: "신문지",
          description: "재활용 가능한 신문지입니다.",
          trashAmount: 1,
          image: "newspaper.png",
        },
      ]);
      console.log("Trash 초기 데이터 삽입 완료");
    } else {
      console.log("Trash 컬렉션에 이미 데이터가 존재합니다.");
    }

    // Obstacles 컬렉션 초기화
    const obstacleCount = await Obstacle.countDocuments();
    if (obstacleCount === 0) {
      await Obstacle.insertMany([
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
      console.log("Obstacle 초기 데이터 삽입 완료");
    } else {
      console.log("Obstacle 컬렉션에 이미 데이터가 존재합니다.");
    }

    // Users 컬렉션 초기화 (admin 계정)
    const userExists = await User.findOne({ id: "admin" });
    if (!userExists) {
      await User.create({
        id: "admin",
        password:
          "$2a$10$RMquu0zGHm.Da/CVZZ1bJOMYwAobwWKd4HYcqkfxBXyekPkkjmMqa",
        nickName: "admin",
        isAdmin: true,
        topRate: 0,
        coin: 0,
        countPlay: 0,
        status: "active",
      });
      console.log("Admin 유저 생성 완료");
    } else {
      console.log("Admin 유저가 이미 존재합니다.");
    }
  } catch (error) {
    console.error("초기 데이터 삽입 중 오류 발생:", error);
  }
};

module.exports = initData;
