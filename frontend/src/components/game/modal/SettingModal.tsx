import { AiFillCloseSquare } from "react-icons/ai";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingModal({
  isOpen,
  onClose,
}: Props): JSX.Element | null {
  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-50"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 max-w-md w-full h-fit flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl py-3 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
          <h1>게임 설정</h1>
        </div>
        <div className="my-8">
          {/* 게임 설정은 추후 뭔가 더 추가되어야 넣을게 떠오를듯.. */}
          <p>배경음악</p>
          <p>효과음</p>
        </div>
      </div>
    </div>
  );
}
