import { useKeyStore } from "@store/keyStore";
import { useEffect } from "react";

/**
 * @description 사용자 키보드 입력을 기반으로 zustand keyStore의 keyState를 업데이트하는 훅
 */
export const useKeyListener = (isListen: boolean) => {
  // zustand store에 명시한 업데이트 함수들
  const { updateKeyDown, updateKeyUp, updateActiveItem } = useKeyStore();

  // 키보드를 눌렀을 때 이벤트 리스너 콜백 함수
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    updateKeyDown(key);
    if (e.key >= "1" && e.key <= "5") {
      updateActiveItem(Number(e.key));
    }
  };

  // 키보드에서 손 뗏을 때 이벤트 리스너 콜백 함수
  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    updateKeyUp(key);
    if (e.key >= "1" && e.key <= "5") {
      updateActiveItem(null);
    }
  };

  useEffect(() => {
    if (isListen) {
      console.log("키보드 이벤트 리스너 연결");
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    } else {
      console.log("키보드 이벤트 리스너 연결 해제");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }

    return () => {
      console.log("키보드 이벤트 리스너 연결 해제");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isListen]);
};
