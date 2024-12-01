import { Stage } from "@pixi/react";
import { Socket } from "socket.io-client";
import { WORLD_H, WORLD_W } from "@constants/game";
import { useStageInit } from "@hooks/game/useStageInit";
import { useSocketRecv } from "@hooks/game/useSocketRecv";
import RenderMap from "@components/game/render/RenderMap";
import RenderPlayer from "@components/game/render/RenderPlayer";
import RenderObstacle from "@components/game/render/RenderObstacle";
import RenderAnotherPlayer from "@components/game/render/RenderAnotherPlayer";
import RenderTrash from "./RenderTrash";
import RenderItem from "./RenderItem";
import RenderWarning from "./RenderWarning";

interface Props {
  socket: Socket | null;
}

/**
 * @description 게임 요소들을 렌더링하는 컴포넌트
 */
export default function RenderGame({ socket }: Props) {
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();

  // 게임과 관련된 모든 이벤트를 수신 및 처리하는 커스텀 훅
  const { anotherPlayersInfo, obstacleInfo, trashInfo, itemInfo } =
    useSocketRecv(socket);

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
      {/* 플레이어와 다른 사용자 렌더링 */}
      <RenderPlayer socket={socket} />
      {anotherPlayersInfo.map((anotherPlayerInfo) => (
        <RenderAnotherPlayer
          anotherPlayerInfo={anotherPlayerInfo}
          key={anotherPlayerInfo.userId}
        />
      ))}

      {/* 방해요소 (상어, 해파리) 렌더링 */}
      {obstacleInfo.map((obstacle) =>
        obstacle.isActive === 0 ? (
          <RenderWarning key={obstacle.objectId} obstacle={obstacle} />
        ) : (
          <RenderObstacle key={obstacle.objectId} obstacle={obstacle} />
        )
      )}

      {trashInfo.map((trash) => (
        <RenderTrash key={trash.objectId} trash={trash} />
      ))}

      {itemInfo.map((item) => (
        <RenderItem key={item.objectId} item={item} />
      ))}
    </Stage>
  );
}
