import ItemInventory from "@components/game/ItemInventory";
import LeaderBoard from "@components/game/LeaderBoard";
import SettingModal from "@components/game/SettingModal";
import ShareModal from "@components/game/ShareModal";
import SideButton from "@components/game/SideButton";
import TutorialModal from "@components/game/TutorialModal";
import { PLAYER_SIZE, WORLD_H, WORLD_W } from "@constants/game";
import { useKeyListener } from "@hooks/game/useKeyListener";
import { useModal } from "@hooks/game/useModal";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { useStageInit } from "@hooks/game/useStageInit";
import { Graphics, Sprite, Stage } from "@pixi/react";
import { Graphics as GraphicsType } from "pixi.js"; // pixi-react의 Graphics 컴포넌트와 네임 충돌이 발생하므로 이름 변경
import { useCallback, useEffect } from "react";

export default function GamePage() {
  // 설정, 공유, 튜토리얼 모달창을 띄울지 결정하고, 토글시키기 위한 함수를 반환
  const { isOpen, toggleModal } = useModal();
  // 초기 pixi.js 스테이지의 비율과 크기를 세팅
  const { width, height } = useStageInit();
  // 캐릭터 이동 && 아이템 사용 관련 키보드 이벤트 리스너 연결하고 키보드 상태를 반환
  const { keyState, activeItem } = useKeyListener(
    !isOpen.tutorial && !isOpen.share && !isOpen.setting
  );
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
    <div className={`relative w-[${width}px] h-[${height}px] bg-stone-800`}>
      <TutorialModal
        isOpen={isOpen.tutorial}
        onClose={() => toggleModal("tutorial")}
      />
      <ShareModal isOpen={isOpen.share} onClose={() => toggleModal("share")} />
      <SettingModal
        isOpen={isOpen.setting}
        onClose={() => toggleModal("setting")}
      />
      <LeaderBoard />
      <ItemInventory activeItem={activeItem} />
      <SideButton toggleModal={toggleModal} />
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
    </div>
  );
}
