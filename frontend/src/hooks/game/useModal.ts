import { IsOpen } from "@@types/ModalType";
import { getLocalStorage, setLocalStorage } from "@utils/localStorage";
import { useCallback, useEffect, useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<IsOpen>({
    setting: false,
    share: false,
    tutorial: false,
    store: false,
  });

  const toggleModal = useCallback((modalName: keyof IsOpen) => {
    setIsOpen((prev) => ({ ...prev, [modalName]: !prev[modalName] }));
  }, []);

  // 초기 접속 시 튜토리얼을 띄울 지 결정하는 useEffect
  useEffect(() => {
    const playHistory = getLocalStorage("playHistory");
    if (!playHistory) {
      setIsOpen((prev) => ({ ...prev, tutorial: true }));
      setLocalStorage("playHistory", "yes");
    }
  }, []);

  return { isOpen, toggleModal };
};
