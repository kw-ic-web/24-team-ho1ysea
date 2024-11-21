import { ObjectPos } from "./GameType";

export type MyItems = {
  itemId: string;
  itemName: string;
  image: string;
  quantity: number;
  description: string;
}[];

export type BuyItem = {
  message: string;
};

export type SellItem = {
  message: string;
};

export type UseItem = {
  message: string;
  id: string;
  quantity: number;
};

export type GameItem = {
  objectId: string;
  itemId: "item001" | "item002";
  position: ObjectPos;
};
