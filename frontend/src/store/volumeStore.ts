import { getLocalStorage, setLocalStorage } from "@utils/localStorage";
import { create } from "zustand";

interface VolumeStore {
  effectVolume: number;
  setEffectVolume: (volume: number) => void;
}

/**
 * @description 효과음 상태값을 관리하는 zustand store
 */
export const useVolumeStore = create<VolumeStore>((set) => ({
  effectVolume: parseFloat(getLocalStorage("effectVolume") || "0.5"),

  setEffectVolume: (volume) => {
    setLocalStorage("effectVolume", volume.toString());
    set({ effectVolume: volume });
  },
}));
