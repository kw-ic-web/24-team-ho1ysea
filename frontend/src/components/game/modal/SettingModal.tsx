import { isAdminApi } from "@apis/adminRestful";
import { useModalStore } from "@store/modalStore";
import { useToastStore } from "@store/toastStore";
import { useVolumeStore } from "@store/volumeStore";
import { deleteLocalStorage, getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export default function SettingModal(): JSX.Element | null {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { isOpen, toggleModal } = useModalStore();
  const { effectVolume, setEffectVolume } = useVolumeStore();
  const navigate = useNavigate();
  const showToast = useToastStore((s) => s.showToast);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal("setting");
    }
  };

  const handleLogoutBtn = () => {
    deleteLocalStorage("token");
    toggleModal("setting");
    navigate("/");
    showToast("로그아웃 되었습니다.");
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

  if (!isOpen.setting) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-40"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 max-w-md w-full h-fit flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl py-3 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={() => toggleModal("setting")}
          />
          <h1>게임 설정</h1>
        </div>
        <div className="w-2/3">
          <div className="mt-6 space-y-4 text-center">
            <div className="space-y-0.5">
              <label className="block text-start text-sm font-medium text-gray-800">
                효과음 볼륨 조절: {(effectVolume * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={effectVolume}
                onChange={(e) => setEffectVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer appearance-none"
              />
            </div>

            <button
              onClick={handleLogoutBtn}
              className="pb-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              로그아웃하기
            </button>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => toggleModal("setting")}
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
