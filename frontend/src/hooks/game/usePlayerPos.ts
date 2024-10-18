import { PLAYER_MOVE } from "@constants/game";
import { useTick } from "@pixi/react";
import { useKeyStore } from "@store/keyStore";
import { usePlayerStore } from "@store/playerStore";
import { isKeyActive } from "@utils/isKeyActive";
import { PlayerPos } from "@@types/PlayerType";

/**
 * @description 키 입력에 따라 플레이어 위치를 계산해서 zustand store에 반영하는 커스텀 훅
 */
export const usePlayerPos = () => {
  const { keyState } = useKeyStore();
  const { updatePlayerPos } = usePlayerStore();

  useTick((deltaTime) => {
    if (!isKeyActive(keyState)) return;

    let dx = 0,
      dy = 0;
    let direction: PlayerPos["direction"] = "bottom";

    if (keyState.isTop) {
      dy -= PLAYER_MOVE * deltaTime;
      direction = "up";
    }
    if (keyState.isRight) {
      dx += PLAYER_MOVE * deltaTime;
      direction = "right";
    }
    if (keyState.isBottom) {
      dy += PLAYER_MOVE * deltaTime;
      direction = "bottom";
    }
    if (keyState.isLeft) {
      dx -= PLAYER_MOVE * deltaTime;
      direction = "left";
    }

    if (dx !== 0 || dy !== 0) {
      updatePlayerPos(dx, dy, direction);
    }
  });
};
