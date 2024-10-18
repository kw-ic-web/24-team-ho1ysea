import ItemInventory from "@components/game/ui/ItemInventory";
import LeaderBoard from "@components/game/ui/LeaderBoard";
import SideButton from "@components/game/ui/SideButton";
import SettingModal from "@components/game/modal/SettingModal";
import ShareModal from "@components/game/modal/ShareModal";
import StoreModal from "@components/game/modal/StoreModal";
import TutorialModal from "@components/game/modal/TutorialModal";
import RenderGame from "@components/game/render/RenderGame";
import { useKeyListener } from "@hooks/game/useKeyListener";
import { useModal } from "@hooks/game/useModal";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { useEffect } from "react";

export default function GamePage() {
  // 설정, 공유, 튜토리얼 모달창을 띄울지 결정하고, 토글시키기 위한 함수를 반환
  const { isOpen, toggleModal } = useModal();
  // 캐릭터 이동 && 아이템 사용 관련 키보드 이벤트 리스너 연결하고 키보드 상태를 반환
  const { keyState, activeItem } = useKeyListener(
    !isOpen.tutorial && !isOpen.share && !isOpen.setting && !isOpen.store
  );
  // 키보드 이벤트를 받아서 캐릭터 좌표와 상점과의 충돌 여부를 반환
  const { playerPos, isCollideStore } = usePlayerPos(keyState);

  // 사용자가 상점 앞에서 Space 키를 누르면 상점 모달 오픈
  useEffect(() => {
    if (isCollideStore && keyState.isSpace) {
      console.log("하이");
      toggleModal("store");
    }
  }, [isCollideStore, keyState.isSpace, toggleModal]);

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
      <StoreModal isOpen={isOpen.store} onClose={() => toggleModal("store")} />
      <LeaderBoard />
      <ItemInventory activeItem={activeItem} />
      <SideButton toggleModal={toggleModal} />
      <RenderGame playerPos={playerPos} />
    </div>
  );
}
