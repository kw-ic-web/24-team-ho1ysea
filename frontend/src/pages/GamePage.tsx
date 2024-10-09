import { useCanvasInit } from "@hooks/useCanvasInit";
import { useGameLoop } from "@hooks/useGameLoop";
import { useKeyListener } from "@hooks/useKeyListener";
import { usePlayerPos } from "@hooks/usePlayerPos";
import { useEffect } from "react";

export default function GamePage() {
  // 초기 canvas의 비율과 크기를 세팅
  const canvasRef = useCanvasInit();
  // 키보드 이벤트 리스너 연결하고 키보드 상태를 반환
  const keyState = useKeyListener();
  // 키보드 이벤트를 받아서 캐릭터 좌표를 반환
  const playerPos = usePlayerPos(keyState);

  // 게임 메인 동작 로직을 담은 훅
  useGameLoop(canvasRef.current, playerPos);

  // 디버깅용 useEffect, 캐릭터 x y값을 콘솔로 출력
  useEffect(() => {
    console.log(`x: ${playerPos.x}, y: ${playerPos.y}`);
  }, [playerPos]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          border: "solid 1px black",
        }}
      >
        CANVAS가 지원되는 브라우저를 사용하세요
      </canvas>
    </div>
  );
}
