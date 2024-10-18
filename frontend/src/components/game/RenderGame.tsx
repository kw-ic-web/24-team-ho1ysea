import { WORLD_H, WORLD_W } from "@constants/game";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { useStageInit } from "@hooks/game/useStageInit";
import RenderMap from "./RenderMap";
import { KeyState } from "@@types/PlayerType";
import RenderPlayer from "./RenderPlayer";
import { Stage } from "@pixi/react";

interface Props {
  keyState: KeyState;
}

export default function RenderGame({ keyState }: Props) {
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();
  // 키보드 이벤트를 받아서 캐릭터 좌표를 반환
  const playerPos = usePlayerPos(keyState);

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
      <RenderMap />
      <RenderPlayer playerPos={playerPos} />
    </Stage>
  );
}
