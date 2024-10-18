import ItemInventory from "@components/game/ItemInventory";
import LeaderBoard from "@components/game/LeaderBoard";
import RenderGame from "@components/game/RenderGame";
import SettingModal from "@components/game/SettingModal";
import ShareModal from "@components/game/ShareModal";
import SideButton from "@components/game/SideButton";
import TutorialModal from "@components/game/TutorialModal";
import { useKeyListener } from "@hooks/game/useKeyListener";
import { useModal } from "@hooks/game/useModal";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { useEffect } from "react";

export default function GamePage() {
  // 설정, 공유, 튜토리얼 모달창을 띄울지 결정하고, 토글시키기 위한 함수를 반환
  const { isOpen, toggleModal } = useModal();
  // 캐릭터 이동 && 아이템 사용 관련 키보드 이벤트 리스너 연결하고 키보드 상태를 반환
  const { keyState, activeItem } = useKeyListener(
    !isOpen.tutorial && !isOpen.share && !isOpen.setting
  );
  // 키보드 이벤트를 받아서 캐릭터 좌표를 반환
  const playerPos = usePlayerPos(keyState);

  // 디버깅용 useEffect, 캐릭터 x y값을 콘솔로 출력
  useEffect(() => {
    console.log(
      `x: ${playerPos.x}, y: ${playerPos.y}, dir: ${playerPos.direction}`
    );
  }, [playerPos]);

  return (
    <div className={`relative bg-stone-800`}>
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
      <RenderGame keyState={keyState} />
    </div>
  );
}
