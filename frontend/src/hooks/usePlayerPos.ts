import { PLAYER_MOVE, PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { throttle } from "@utils/throttle";
import { useCallback, useEffect, useState } from "react";

export const usePlayerPos = (keyState: {
  isLeft: boolean;
  isRight: boolean;
  isTop: boolean;
  isBottom: boolean;
}) => {
  // 초기 플레이어 좌표
  const [myPos, setMyPos] = useState<{ x: number; y: number }>({
    x: 800,
    y: 600,
  });

  // 스로틀을 사용해 cpu 성능에 상관없는 이동을 보장함
  const movePlayer = useCallback(
    throttle((dx: number, dy: number) => {
      setMyPos((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    }, 50), // 50ms 간격 이동
    []
  );

  // 키보드 입력에 따라 플레이어 좌표 변경
  // 만약 게임 WORLD 밖이라면 좌표 변경 X
  useEffect(() => {
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
      movePlayer(dx, dy);
    }
  }, [keyState, movePlayer, myPos]);

  // 플레이어 좌표 반환
  return myPos;
};
