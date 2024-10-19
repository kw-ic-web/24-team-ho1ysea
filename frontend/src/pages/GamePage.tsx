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
import { useEffect } from "react";
import { usePlayerStore } from "@store/playerStore";
import { useKeyStore } from "@store/keyStore";
import ToastModal from "@components/common/ToastModal";

export default function GamePage() {
  const { isCollideStore } = usePlayerStore();
  const { keyState } = useKeyStore();
  // 설정, 공유, 튜토리얼 모달창을 띄울지 결정하고, 토글시키기 위한 함수를 반환
  const { isOpen, toggleModal } = useModal();
  // 캐릭터 이동 && 아이템 사용 관련 키보드 이벤트 리스너 연결
  useKeyListener(
    !isOpen.tutorial && !isOpen.share && !isOpen.setting && !isOpen.store
  );

  // 사용자가 상점 앞에서 Space 키를 누르면 상점 모달 오픈
  useEffect(() => {
    if (isCollideStore && keyState.isSpace) {
      toggleModal("store");
    }
  }, [isCollideStore, keyState.isSpace, toggleModal]);

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
      <ItemInventory />
      <SideButton toggleModal={toggleModal} />
      <RenderGame />
      <ToastModal />
    </div>
  );
}
