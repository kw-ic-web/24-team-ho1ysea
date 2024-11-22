import { WORLD_H, WORLD_W } from "@constants/game";
import { useStageInit } from "@hooks/game/useStageInit";
import RenderMap from "@components/game/render/RenderMap";
import RenderPlayer from "@components/game/render/RenderPlayer";
import RenderObstacle from "@components/game/render/RenderObstacle";
import RenderAnotherPlayer from "@components/game/render/RenderAnotherPlayer";
import { Stage } from "@pixi/react";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { PlayerInfo } from "@@types/GameType";
import { Obstacle } from "@@types/obstacleType";
import { GameItem } from "@@types/itemsType";
import { Trash } from "@@types/trashType";
import { useGameDataStore } from "@store/gameDataStore";
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
  // 플레이어의 아이디
  const userId = useGameDataStore((s) => s.userId);
  const setMyTrashAmount = useGameDataStore((s) => s.setMyTrashAmount);

  // 플레이어를 제외한 나머지 유저의 정보가 담길 배열 <- 소켓에서 가져오는 데이터를 필터링해서 저장
  const [anotherPlayersInfo, setAnotherPlayersInfo] = useState<PlayerInfo[]>(
    []
  );
  const [obstacleInfo, setObstacleInfo] = useState<Obstacle[]>([]);
  const [trashInfo, setTrashInfo] = useState<Trash[]>([]);
  const [itemInfo, setItemInfo] = useState<GameItem[]>([]);

  // 소켓이 오픈됐고, 플레이어 아이디를 잘 받아왔으면 서버로부터 updateCharacterPosition 이벤트 수신 시작
  useEffect(() => {
    if (socket && userId) {
      socket.on("updateCharacterPosition", (data: PlayerInfo[]) => {
        setAnotherPlayersInfo(data.filter((d) => d.userId !== userId));
      });
      socket.on("generateRandomObstacle", (data: Obstacle[]) => {
        setObstacleInfo(data);
      });
      socket.on("generateRandomItem", (data: GameItem[]) => {
        setItemInfo(data);
      });
      socket.on("generateRandomTrash", (data: Trash[]) => {
        setTrashInfo(data);
      });
      socket.on("collisionTrash", (collisionTrashRes: Trash[]) => {
        setTrashInfo(collisionTrashRes);
      });
      socket.on("collisionItem", (collisionItemRes: GameItem[]) => {
        setItemInfo(collisionItemRes);
      });
      socket.on("collisionObstacle", (collisionObstacleRes: Obstacle[]) => {
        setObstacleInfo(collisionObstacleRes);
      });
      socket.on("getTrashAmount", (trashAmountRes: number) => {
        setMyTrashAmount(trashAmountRes);
      });
    } else if (!socket) {
      setAnotherPlayersInfo([]);
      setObstacleInfo([]);
      setTrashInfo([]);
      setItemInfo([]);
    }
  }, [setMyTrashAmount, socket, userId]);

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
