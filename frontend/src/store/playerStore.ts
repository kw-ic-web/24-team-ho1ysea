import { create } from "zustand";
import {
  PLAYER_SIZE_H,
  PLAYER_SIZE_W,
  WORLD_H,
  WORLD_W,
} from "@constants/game";
import { PlayerPos } from "@@types/GameType";
import { isCollidingStore } from "@utils/isCollidingStore";

interface PlayerStoreType {
  playerPos: PlayerPos;
  confusionDirection: 1 | -1;
  isCollideStore: boolean;
  updatePlayerPos: (
    dx: number,
    dy: number,
    direction: PlayerPos["direction"]
  ) => void;
  toggleConfusionDirection: (duration: number) => void;
  resetPlayerPos: () => void;
}

/**
 * @description 플레이어 위치 정보, 상점과 충돌 여부 관리를 위한 zustand 스토어
 */
export const usePlayerStore = create<PlayerStoreType>((set) => ({
  playerPos: {
    x: 30,
    y: WORLD_H - 60,
    direction: "bottom",
  },
  confusionDirection: 1,
  isCollideStore: false,
  updatePlayerPos: (dx, dy, direction) =>
    set((prev) => {
      const newX = prev.playerPos.x + dx * prev.confusionDirection;
      const newY = prev.playerPos.y + dy * prev.confusionDirection;
      if (!isCollidingStore(newX, newY)) {
        return {
          isCollideStore: false,
          playerPos: {
            x: Math.min(Math.max(newX, 0), WORLD_W - PLAYER_SIZE_W),
            y: Math.min(Math.max(newY, 0), WORLD_H - PLAYER_SIZE_H),
            direction,
          },
        };
      } else {
        return {
          isCollideStore: true,
          playerPos: {
            ...prev.playerPos,
            direction,
          },
        };
      }
    }),
  toggleConfusionDirection: (duration: number) => {
    set({
      confusionDirection: -1,
    });
    setTimeout(() => {
      set({ confusionDirection: 1 });
    }, duration);
  },
  resetPlayerPos: () => {
    set({
      isCollideStore: false,
      playerPos: { x: 30, y: WORLD_H - 60, direction: "bottom" },
    });
  },
}));
