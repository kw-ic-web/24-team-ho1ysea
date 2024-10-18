import { WORLD_H, WORLD_W } from "@constants/game";
import { useStageInit } from "@hooks/game/useStageInit";
import RenderMap from "@components/game/render/RenderMap";
import RenderPlayer from "@components/game/render/RenderPlayer";
import { PlayerPos } from "@@types/PlayerType";
import { Stage } from "@pixi/react";

interface Props {
  playerPos: PlayerPos;
}

export default function RenderGame({ playerPos }: Props) {
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();

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
