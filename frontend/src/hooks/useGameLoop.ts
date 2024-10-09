import { PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { useCallback, useEffect } from "react";

export const useGameLoop = (
  canvas: HTMLCanvasElement | null,
  playerPos: {
    x: number;
    y: number;
  }
) => {
  // 캔버스 리셋
  const clearBg = useCallback(() => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        console.log("배경 클리어");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "green";
        ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      }
    }
  }, [canvas]);

  // 현재 플레이어 렌더링
  const drawPlayer = useCallback(() => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        console.log("캐릭터 재 렌더링");
        const { x, y } = playerPos;
        ctx.fillStyle = "white";
        // x, y 좌표에서 네모 렌더링
        ctx.fillRect(x + PLAYER_SIZE / 2, y - PLAYER_SIZE / 2, 20, 20);
      }
    }
  }, [canvas, playerPos]);

  useEffect(() => {
    clearBg();
    drawPlayer();
  }, [clearBg, drawPlayer]);
};
