import TutorialModal from "@components/game/TutorialModal";
import { PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { useKeyListener } from "@hooks/useKeyListener";
import { usePlayerPos } from "@hooks/usePlayerPos";
import { useStageInit } from "@hooks/useStageInit";
import { Graphics, Stage } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js"; // pixi-react의 Graphics 컴포넌트와 네임 충돌이 발생하므로 이름 변경
import { useCallback, useEffect, useState } from "react";

export default function GamePage() {
  const [isTutorial, setIsTutorial] = useState<boolean>(false);
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();
  // 키보드 이벤트 리스너 연결하고 키보드 상태를 반환
  const keyState = useKeyListener();
  // 키보드 이벤트를 받아서 캐릭터 좌표를 반환
  const playerPos = usePlayerPos(keyState);

  // 내 캐릭터 렌더링 함수
  const drawPlayer = useCallback(
    (g: GraphicsType) => {
      g.clear();
      g.beginFill(0xff0000);
      g.drawRect(
        playerPos.x + PLAYER_SIZE / 2,
        playerPos.y - PLAYER_SIZE / 2,
        PLAYER_SIZE,
        PLAYER_SIZE
      ); // 캐릭터의 위치 및 크기 <- 캐릭터 좌표를 변경하면 자동으로 리렌더링됨
      g.endFill();
    },
    [playerPos.x, playerPos.y]
  );

  // 디버깅용 useEffect, 캐릭터 x y값을 콘솔로 출력
  useEffect(() => {
    console.log(`x: ${playerPos.x}, y: ${playerPos.y}`);
  }, [playerPos]);

  return (
    <div className={`relative w-[${width}px] h-[${height}px]`}>
      <TutorialModal isOpen={isTutorial} onClose={() => setIsTutorial(false)} />
      <Stage
        width={WORLD_W}
        height={WORLD_H}
        options={{ backgroundColor: 0x1099bb }}
        style={{
          width: width,
          height: height,
          display: "block",
          margin: "0 auto",
          border: "solid 1px black",
        }}
      >
        <Graphics draw={drawPlayer} />
      </Stage>
    </div>
  );
}
