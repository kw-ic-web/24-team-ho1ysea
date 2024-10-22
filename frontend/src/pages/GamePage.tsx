import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { validateTokenApi } from "@apis/userRestful";
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
import { usePlayerStore } from "@store/playerStore";
import { useKeyStore } from "@store/keyStore";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { useGameDataStore } from "@store/gameDataStore";

export default function GamePage() {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { isCollideStore } = usePlayerStore();
  const { initialize } = useGameDataStore();
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

  // JWT 토큰이 없거나, 유효하지 않으면 LandingPage로 리다이렉트
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getLocalStorage("token");
        if (!token) {
          showToast("토큰이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/");
          return;
        }
        await validateTokenApi(token).then((res) => res.data.message);
        await initialize(token);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err.response);
          showToast("인증 실패, 다시 로그인해주세요.");
          navigate("/");
          return;
        }
      }
    };
    validateToken();
  }, [initialize, navigate, showToast]);

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
    </div>
  );
}
