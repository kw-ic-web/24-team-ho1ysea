import { PLAYER_SIZE, SHOP } from "@constants/game";

export const isCollidingStore = (x: number, y: number) => {
  return (
    x < SHOP.x + SHOP.width &&
    x + PLAYER_SIZE > SHOP.x &&
    y < SHOP.y + SHOP.height &&
    y + PLAYER_SIZE > SHOP.y
  );
};
