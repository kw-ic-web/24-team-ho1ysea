import { create } from "zustand";
import { IsOpen } from "@@types/ModalType";

interface ModalStore {
  isOpen: IsOpen;
  toggleModal: (modalName: keyof IsOpen) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: {
    setting: false,
    share: false,
    tutorial: false,
    store: false,
  },

  toggleModal: (modalName) =>
    set((prev) => ({
      isOpen: { ...prev.isOpen, [modalName]: !prev.isOpen[modalName] },
    })),
}));
