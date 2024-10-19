import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  showToast: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  showToast: (message, duration = 3000) => {
    const id = crypto.randomUUID(); // 토스트 메시지 ID 생성
    set((state) => ({
      toasts: [...state.toasts, { id, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
