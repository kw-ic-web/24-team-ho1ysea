import { useModalStore } from "@store/modalStore";
import { useToastStore } from "@store/toastStore";
import { AiFillCloseSquare } from "react-icons/ai";

export default function ShareModal(): JSX.Element | null {
  const { isOpen, toggleModal } = useModalStore();
  const showToast = useToastStore((s) => s.showToast);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal("share");
    }
  };

  const handleCopyBtn = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      showToast("복사되었습니다");
    } catch (e) {
      console.error(e);
      showToast("복사에 실패했습니다");
    }
  };

  if (!isOpen.share) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-40"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 max-w-md w-full h-fit flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl py-3 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={() => toggleModal("share")}
          />
          <h1>게임 공유하기</h1>
        </div>
        <p>게임이 재미있으셨다면, 주변 사람들에게 알려주세요!</p>
        <div className="flex justify-center items-center my-8">
          <div className="rounded-l-lg border border-r-0 border-stone-800 px-4 py-2">
            {window.location.origin}
          </div>
          <button
            onClick={handleCopyBtn}
            className="rounded-r-lg border text-slate-200 border-stone-800 bg-blue-500 hover:bg-blue-600 px-4 py-2"
          >
            복사하기
          </button>
        </div>
      </div>
    </div>
  );
}
