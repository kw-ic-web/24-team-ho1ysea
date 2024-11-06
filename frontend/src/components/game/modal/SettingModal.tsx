import { isAdminApi } from "@apis/adminRestful";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingModal({
  isOpen,
  onClose,
}: Props): JSX.Element | null {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const validate = async (token: string) => {
      isAdminApi(token)
        .then(() => setIsAdmin(true))
        .catch(() => setIsAdmin(false));
    };

    const token = getLocalStorage("token");
    if (token) {
      validate(token);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-40"
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
        <div className="w-2/3">
          <div className="mt-6 space-y-4 text-center">
            <div className="space-y-0.5">
              <label className="block text-start text-sm font-medium text-gray-800">
                배경음악 조절
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-0.5">
              <label className="block text-start text-sm font-medium text-gray-800">
                효과음 조절
              </label>
              <input
                type="range"
                min="0"
                max="100"
                className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="block pb-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                관리자 페이지로 이동
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
