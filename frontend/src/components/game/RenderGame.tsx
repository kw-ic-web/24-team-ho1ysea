import { useCallback } from "react";
import { PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { useStageInit } from "@hooks/game/useStageInit";
import { Graphics, Sprite, Stage } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js"; // pixi-react의 Graphics 컴포넌트와 네임 충돌이 발생하므로 이름 변경

interface Props {
  keyState: {
    isLeft: boolean;
    isRight: boolean;
    isTop: boolean;
    isBottom: boolean;
  };
}

export default function RenderGame({ keyState }: Props) {
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();
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

  return (
    <Stage
      width={WORLD_W}
      height={WORLD_H}
      style={{
        width: width,
        height: height,
        display: "block",
        margin: "0 auto",
        border: "solid 1px black",
      }}
    >
      <Sprite image="/images/map.png" x={0} y={0} />
      <Sprite
        image="/images/shop.png"
        x={WORLD_W - 200}
        y={WORLD_H - 180}
        scale={0.4}
      />
      <Graphics draw={drawPlayer} />
    </Stage>
  );
}
