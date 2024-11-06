import { WORLD_H, WORLD_W } from "@constants/game";
import { useStageInit } from "@hooks/game/useStageInit";
import RenderMap from "@components/game/render/RenderMap";
import RenderPlayer from "@components/game/render/RenderPlayer";
import { Stage } from "@pixi/react";
import { Socket } from "socket.io-client";
import RenderAnotherPlayer from "./RenderAnotherPlayer";
import { useEffect, useState } from "react";
import { PlayerInfo } from "@@types/GameType";
import { useGameDataStore } from "@store/gameDataStore";

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

  // 플레이어를 제외한 나머지 유저의 정보가 담길 배열 <- 소켓에서 가져오는 데이터를 필터링해서 저장
  const [anotherPlayersInfo, setAnotherPlayersInfo] = useState<PlayerInfo[]>(
    []
  );

  // 소켓이 오픈됬고, 플레이어 아이디를 잘 받아왔으면 서버로부터 updateCharacterPosition 이벤트 수신 시작
  useEffect(() => {
    if (socket && userId) {
      socket.on("updateCharacterPosition", (datas: PlayerInfo[]) => {
        setAnotherPlayersInfo(datas.filter((data) => data.userId !== userId));
      });
    } else if (!socket) {
      setAnotherPlayersInfo([]);
    }
  }, [socket, userId]);

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
      <RenderPlayer socket={socket} />
      {anotherPlayersInfo.map((anotherPlayerInfo) => (
        <RenderAnotherPlayer
          anotherPlayerInfo={anotherPlayerInfo}
          key={anotherPlayerInfo.userId}
        />
      ))}
    </Stage>
  );
}
