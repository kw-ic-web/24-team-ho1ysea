import { reportApi } from "@apis/userRestful";
import { useModalStore } from "@store/modalStore";
import { usePlayerInfoStore } from "@store/playerInfoStore";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { MouseEvent, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

function PlayerReportModal(): JSX.Element | null {
  const [textInput, setTextInput] = useState<string>("");
  const { isOpen, toggleModal } = useModalStore();
  const { playerInfo, removePlayerInfo } = usePlayerInfoStore();
  const showToast = useToastStore((s) => s.showToast);

  const handleBgClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const closeModal = () => {
    toggleModal("playerInfo");
    setTextInput("");
    removePlayerInfo();
  };

  const handleSubmit = async () => {
    const token = getLocalStorage("token");
    if (!textInput || !token || !playerInfo) return;

    try {
      const { data } = await reportApi(
        token,
        playerInfo.userId,
        playerInfo.nickName,
        textInput
      );
      console.log(data);
      showToast("신고가 완료되었습니다. 관리자가 추후 처리할 예정입니다.");
      toggleModal("playerInfo");
    } catch (e) {
      console.error(e);
      showToast("신고 과정에서 에러가 발생했습니다.");
    }
  };

  if (!isOpen.playerInfo || !playerInfo) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-50"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 w-full max-w-screen-lg flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-base sm:text-2xl pt-2 pb-0 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={closeModal}
          />
          <h1>플레이어 신고</h1>
          <p className="text-sm sm:text-base text-gray-800 pt-2">
            닉네임: {playerInfo.nickName}
          </p>
          <div className="flex flex-col gap-4 w-full px-6 justify-self-center m-2">
            <textarea
              className="text-sm sm:text-base h-24 p-2 rounded-lg"
              placeholder="신고 사유를 입력해주세요."
              onChange={(e) => setTextInput(e.target.value)}
              value={textInput}
              autoFocus
            />
            <button
              disabled={!textInput}
              onClick={handleSubmit}
              className="text-sm sm:text-base rounded-lg border text-slate-200 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 px-4 py-2"
            >
              신고하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerReportModal;
