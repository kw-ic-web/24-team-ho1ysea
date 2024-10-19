import { useToastStore } from "@store/toastStore";

export default function ToastModal() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-opacity-80 bg-slate-800 hover:bg-slate-700 transition-colors text-slate-200 py-3 px-5 rounded-lg cursor-pointer text-lg z-50 animate-fadeInOut"
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
