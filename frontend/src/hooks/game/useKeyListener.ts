import { KeyState } from "@@types/PlayerType";
import { useEffect, useState } from "react";

/**
 * @description 사용자 키보드 입력을 state로 반환해주는 훅
 * @returns 키보드 입력 state와 활성화된 아이템을 반환
 */
export const useKeyListener = (isListen: boolean) => {
  // 캐릭터를 이동시키는 키 입력 상태를 관리하는 state
  const [keyState, setKeyState] = useState<KeyState>({
    isLeft: false,
    isRight: false,
    isTop: false,
    isBottom: false,
    isSpace: false,
  });
  // 아이템을 사용하는 키 입력 상태를 관리하는 state
  const [activeItem, setActiveItem] = useState<number | null>(null);

  // 키보드를 눌렀을 때 이벤트 리스너 콜백 함수
  const handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setKeyState((prev) => ({
      ...prev,
      isLeft: key === "a" || key === "arrowleft",
      isRight: key === "d" || key === "arrowright",
      isTop: key === "w" || key === "arrowup",
      isBottom: key === "s" || key === "arrowdown",
      isSpace: key === " ",
    }));
    if (e.key >= "1" && e.key <= "5") {
      setActiveItem(Number(e.key));
    }
  };

  // 키보드에서 손 뗏을 때 이벤트 리스너 콜백 함수
  const handleKeyUp = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    setKeyState((prev) => ({
      ...prev,
      isLeft: prev.isLeft && key !== "a" && key !== "arrowleft",
      isRight: prev.isRight && key !== "d" && key !== "arrowright",
      isTop: prev.isTop && key !== "w" && key !== "arrowup",
      isBottom: prev.isBottom && key !== "s" && key !== "arrowdown",
      isSpace: prev.isSpace && key !== " ",
    }));
    if (e.key >= "1" && e.key <= "5") {
      setActiveItem(null);
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

  return { keyState, activeItem };
};
