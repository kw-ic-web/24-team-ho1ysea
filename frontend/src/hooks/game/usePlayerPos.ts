import { PLAYER_MOVE, PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { useEffect, useState } from "react";

export const usePlayerPos = (keyState: {
  isLeft: boolean;
  isRight: boolean;
  isTop: boolean;
  isBottom: boolean;
}) => {
  // 초기 플레이어 좌표
  const [myPos, setMyPos] = useState<{ x: number; y: number }>({
    x: 30,
    y: WORLD_H - 60,
  });

  // 키보드 입력에 따라 플레이어 좌표 변경
  // 만약 게임 WORLD 밖이라면 좌표 변경 X
  useEffect(() => {
    let cnt = 0,
      requestId;
    let dx = 0;
    let dy = 0;

    if (myPos.y - PLAYER_SIZE / 2 > 0 && keyState.isTop) {
      dy -= PLAYER_MOVE;
    }
    if (myPos.x + PLAYER_SIZE < WORLD_W && keyState.isRight) {
      dx += PLAYER_MOVE;
    }
    if (myPos.y + PLAYER_SIZE / 2 < WORLD_H && keyState.isBottom) {
      dy += PLAYER_MOVE;
    }
    if (myPos.x + PLAYER_SIZE > 0 && keyState.isLeft) {
      dx -= PLAYER_MOVE;
    }

    if (dx !== 0 || dy !== 0) {
      const animation = () => {
        setMyPos((prev) => ({
          x: Math.min(Math.max(prev.x + dx / 10, 0), WORLD_W - PLAYER_SIZE * 2),
          y: Math.min(
            Math.max(prev.y + dy / 10, PLAYER_SIZE),
            WORLD_H - PLAYER_SIZE
          ),
        }));
        requestId = requestAnimationFrame(animation);
        cnt++;
        if (cnt == 10) cancelAnimationFrame(requestId);
      };
      requestAnimationFrame(animation);
      // movePlayer(dx, dy);
    }
  }, [keyState, myPos]);

  // 플레이어 좌표 반환
  return myPos;
};
