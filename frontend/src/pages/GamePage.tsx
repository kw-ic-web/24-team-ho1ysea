import { useEffect } from "react";
import ItemInventory from "@components/game/ui/ItemInventory";
import LeaderBoard from "@components/game/ui/LeaderBoard";
import SideButton from "@components/game/ui/SideButton";
import SettingModal from "@components/game/modal/SettingModal";
import ShareModal from "@components/game/modal/ShareModal";
import StoreModal from "@components/game/modal/StoreModal";
import TutorialModal from "@components/game/modal/TutorialModal";
import PlayerReportModal from "@components/game/modal/PlayerReportModal";
import RenderGame from "@components/game/render/RenderGame";
import { useKeyListener } from "@hooks/game/useKeyListener";
import { usePlayerStore } from "@store/playerStore";
import { useKeyStore } from "@store/keyStore";
import { useSocket } from "@hooks/game/useSocket";
import { useCheckLogin } from "@hooks/game/useCheckLogin";
import { useModalStore } from "@store/modalStore";
import { getLocalStorage, setLocalStorage } from "@utils/localStorage";

export default function GamePage() {
  const isCollideStore = usePlayerStore((s) => s.isCollideStore);
  const keyState = useKeyStore((s) => s.keyState);
  const { isOpen, toggleModal } = useModalStore();
  const { isJoinGameRoom, socketRef } = useSocket();

  // 캐릭터 이동 && 아이템 사용 관련 키보드 이벤트 리스너 연결
  useKeyListener(Object.values(isOpen).every((e) => !e));

  // 초기접속이면 튜토리얼 모달을 열고, 히스토리를 로컬스토리지에 저장
  useEffect(() => {
    const playHistory = getLocalStorage("playHistory");
    if (!playHistory) {
      toggleModal("tutorial");
      setLocalStorage("playHistory", "yes");
    }
  }, [toggleModal]);

  // 사용자가 상점 앞에서 Space 키를 누르면 상점 모달 오픈
  useEffect(() => {
    if (isCollideStore && keyState.isSpace) {
      toggleModal("store");
    }
  }, [isCollideStore, keyState.isSpace, toggleModal]);

  // JWT 토큰이 없거나, 유효하지 않으면 LandingPage로 리다이렉트
  // 정상적으로 로그인 되었으면, 계정 정보들을 백엔드에서 전부 가져옴
  useCheckLogin();

  return (
    <div className="relative bg-stone-800">
      <TutorialModal />
      <ShareModal />
      <SettingModal />
      <StoreModal />
      <PlayerReportModal />
      <LeaderBoard isJoinGameRoom={isJoinGameRoom} socket={socketRef.current} />
      <ItemInventory />
      <SideButton toggleModal={toggleModal} />
      <RenderGame socket={socketRef.current} />
    </div>
  );
}
