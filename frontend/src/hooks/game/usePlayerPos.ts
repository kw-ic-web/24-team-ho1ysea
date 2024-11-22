import { useTick } from "@pixi/react";
import { useKeyStore } from "@store/keyStore";
import { usePlayerStore } from "@store/playerStore";
import { isKeyActive } from "@utils/isKeyActive";
import { PlayerPos } from "@@types/GameType";

/**
 * @description 키 입력에 따라 플레이어 위치를 계산해서 zustand store에 반영하는 커스텀 훅
 */
export const usePlayerPos = (playerSpeed: number) => {
  const keyState = useKeyStore((s) => s.keyState);
  const updatePlayerPos = usePlayerStore((s) => s.updatePlayerPos);

  useTick((deltaTime) => {
    if (!isKeyActive(keyState)) return;

    let dx = 0,
      dy = 0;
    let direction: PlayerPos["direction"] = "bottom";

    if (keyState.isTop) {
      dy -= playerSpeed * deltaTime;
      direction = "up";
    }
    if (keyState.isRight) {
      dx += playerSpeed * deltaTime;
      direction = "right";
    }
    if (keyState.isBottom) {
      dy += playerSpeed * deltaTime;
      direction = "bottom";
    }
    if (keyState.isLeft) {
      dx -= playerSpeed * deltaTime;
      direction = "left";
    }

    if (dx !== 0 || dy !== 0) {
      updatePlayerPos(dx, dy, direction);
    }
  });
};
