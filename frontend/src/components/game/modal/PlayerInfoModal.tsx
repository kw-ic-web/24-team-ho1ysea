import { useModalStore } from "@store/modalStore";
import { usePlayerInfoStore } from "@store/playerInfoStore";
import { MouseEvent } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

function PlayerInfoModal(): JSX.Element | null {
  const { isOpen, toggleModal } = useModalStore();
  const { playerInfo, removePlayerInfo } = usePlayerInfoStore();

  const handleBgClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const closeModal = () => {
    toggleModal("playerInfo");
    removePlayerInfo();
  };

  if (!isOpen.playerInfo || !playerInfo) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-50"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 w-full max-w-screen-lg flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl pt-2 pb-0 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={closeModal}
          />
          <h1>플레이어 정보</h1>
          <p>{playerInfo.nickName}</p>
          <p>{playerInfo.userId}</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerInfoModal;
