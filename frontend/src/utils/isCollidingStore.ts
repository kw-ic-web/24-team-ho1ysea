import { PLAYER_SIZE_H, PLAYER_SIZE_W, SHOP } from "@constants/game";

export const isCollidingStore = (x: number, y: number) => {
  return (
    x < SHOP.x + SHOP.width - 20 &&
    x + PLAYER_SIZE_W > SHOP.x &&
    y < SHOP.y + SHOP.height &&
    y + PLAYER_SIZE_H > SHOP.y
  );
};
