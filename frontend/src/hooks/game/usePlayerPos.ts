import { PlayerPos } from "@@types/PlayerType";
import {
  PLAYER_SIZE_H,
  PLAYER_SIZE_W,
  PLAYER_MOVE,
  WORLD_H,
  WORLD_W,
} from "@constants/game";
import { isCollidingStore } from "@utils/isCollidingStore";
import { useEffect, useState } from "react";

export const usePlayerPos = (keyState: {
  isLeft: boolean;
  isRight: boolean;
  isTop: boolean;
  isBottom: boolean;
}) => {
  // 초기 플레이어 좌표
  const [playerPos, setPlayerPos] = useState<PlayerPos>({
    x: 30,
    y: WORLD_H - 60,
    direction: "bottom",
  });
  const [isCollideStore, setIsCollideStore] = useState<boolean>(false);

  // 키보드 입력에 따라 플레이어 좌표 변경
  // 만약 게임 WORLD 밖이라면 좌표 변경 X
  useEffect(() => {
    let cnt = 0,
      requestId: number;
    let dx = 0;
    let dy = 0;
    let direction: typeof playerPos.direction;

    if (playerPos.y > 0 && keyState.isTop) {
      dy -= PLAYER_MOVE;
      direction = "up";
    }
    if (playerPos.x + PLAYER_SIZE_W < WORLD_W && keyState.isRight) {
      dx += PLAYER_MOVE;
      direction = "right";
    }
    if (playerPos.y + PLAYER_SIZE_H / 2 < WORLD_H && keyState.isBottom) {
      dy += PLAYER_MOVE;
      direction = "bottom";
    }
    if (playerPos.x + PLAYER_SIZE_W > 0 && keyState.isLeft) {
      dx -= PLAYER_MOVE;
      direction = "left";
    }

    if (dx !== 0 || dy !== 0) {
      const newX = playerPos.x + dx / 10;
      const newY = playerPos.y + dy / 10;

      if (!isCollidingStore(newX, newY)) {
        setIsCollideStore(false);
        const animation = () => {
          setPlayerPos({
            x: Math.min(Math.max(newX, 0), WORLD_W - PLAYER_SIZE_W),
            y: Math.min(Math.max(newY, 0), WORLD_H - PLAYER_SIZE_H),
            direction,
          });
          requestId = requestAnimationFrame(animation);
          cnt++;
          if (cnt == 10) cancelAnimationFrame(requestId);
        };
        requestAnimationFrame(animation);
      } else {
        setIsCollideStore(true);
      }
    }
  }, [keyState, playerPos]);

  // 플레이어 좌표 반환
  return { playerPos, isCollideStore };
};
