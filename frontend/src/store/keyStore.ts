import { KeyState } from "@@types/PlayerType";
import { create } from "zustand";

interface KeyStoreType {
  keyState: KeyState;
  activeItem: number | null;
  updateKeyDown: (key: string) => void;
  updateKeyUp: (key: string) => void;
  updateActiveItem: (activeItem: number | null) => void;
}

/**
 * @description 키 입력과 아이템 사용 관리를 위한 zustand 스토어
 */
export const useKeyStore = create<KeyStoreType>((set) => ({
  keyState: {
    isLeft: false,
    isRight: false,
    isTop: false,
    isBottom: false,
    isSpace: false,
  },
  activeItem: null,
  updateKeyDown: (key: string) =>
    set((prev) => ({
      ...prev,
      keyState: {
        ...prev.keyState,
        isLeft: key === "arrowleft",
        isRight: key === "arrowright",
        isTop: key === "arrowup",
        isBottom: key === "arrowdown",
        isSpace: key === " ",
      },
    })),
  updateKeyUp: (key: string) =>
    set((prev) => ({
      ...prev,
      keyState: {
        isLeft: prev.keyState.isLeft && key !== "arrowleft",
        isRight: prev.keyState.isRight && key !== "arrowright",
        isTop: prev.keyState.isTop && key !== "arrowup",
        isBottom: prev.keyState.isBottom && key !== "arrowdown",
        isSpace: prev.keyState.isSpace && key !== " ",
      },
    })),
  updateActiveItem: (activeItem) =>
    set((prev) => ({
      ...prev,
      activeItem,
    })),
}));
