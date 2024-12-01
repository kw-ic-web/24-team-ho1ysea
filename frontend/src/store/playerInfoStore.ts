import { create } from "zustand";
import { PlayerInfo } from "@@types/GameType";

interface PlayerInfoStore {
  playerInfo: Omit<PlayerInfo, "position"> | null;
  setPlayerInfo: (userId: string, nickName: string) => void;
  removePlayerInfo: () => void;
}

export const usePlayerInfoStore = create<PlayerInfoStore>((set) => ({
  playerInfo: null,
  setPlayerInfo: (userId, nickName) =>
    set({ playerInfo: { userId, nickName } }),
  removePlayerInfo: () => set({ playerInfo: null }),
}));
