import { getLocalStorage, setLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

/**
 * @description 튜토리얼 창을 띄울지 결정하고, 닫거나 새로 열기 위한 함수를 반환
 */
export const useTutorial = () => {
  const [isTutorial, setIsTutorial] = useState<boolean>(false);

  // 초기 접속 시 튜토리얼을 띄울 지 결정하는 useEffect
  useEffect(() => {
    const playHistory = getLocalStorage("playHistory");
    if (!playHistory) {
      setIsTutorial(true);
      setLocalStorage("playHistory", "yes");
    }
  }, []);

  // 튜토리얼을 닫는 함수
  const handleCloseTutorial = () => {
    setIsTutorial(false);
  };

  // 튜토리얼을 여는 함수
  const handleOpenTutorial = () => {
    setIsTutorial(true);
  };

  return { isTutorial, handleCloseTutorial, handleOpenTutorial };
};
