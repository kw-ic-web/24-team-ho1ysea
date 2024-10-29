import { useState } from "react";
import { User } from "@@types/adminType";
import { AiFillCloseSquare } from "react-icons/ai";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { banUserApi } from "@apis/adminRestful";
import { useToastStore } from "@store/toastStore";
import Loading from "@components/common/Loading";

interface Props {
  selectedUser: User | null;
  onClose: () => void;
}

export default function BanModal({ selectedUser, onClose }: Props) {
  const [bannedReason, setBannedReason] = useState<string>("");
  const [banDuration, setBanDuration] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showToast = useToastStore((state) => state.showToast);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleBan = async () => {
    // TODO: 유저 밴 로직 실행
    if (!selectedUser) return;
    if (!bannedReason || banDuration <= 0) return;

    const token = getLocalStorage("token");
    if (!token) return;

    try {
      setIsLoading(true);
      const message = await banUserApi(
        token,
        selectedUser.userId,
        bannedReason,
        banDuration
      ).then((res) => res.data.message);
      setIsLoading(false);
      showToast(message);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (isAxiosError<{ message: string }>(err) && err.response) {
        showToast(err.response.data.message);
      }
    }
    onClose();
  };

  if (!selectedUser) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-40"
      onClick={handleBgClick}
    >
      <Loading isLoading={isLoading} />
      <div className="bg-slate-200 p-6 m-2 mx-8 sm:max-w-md sm:w-full sm:h-fit sm:p-8 flex flex-col items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xl py-3">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-10 sm:h-10 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
          <h2>유저 재재</h2>
        </div>

        <p className="mt-4 text-sm">
          <strong>{selectedUser.nickName}</strong> (ID: {selectedUser.userId})
          유저를 재재하시겠습니까?
        </p>

        <div className="w-full mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            재재 사유
          </label>
          <textarea
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="재재 사유를 입력하세요."
            value={bannedReason}
            onChange={(e) => setBannedReason(e.target.value)}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            재재 기간 (일)
          </label>
          <input
            type="number"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="밴 기간을 입력하세요."
            min={1}
            value={banDuration}
            onChange={(e) => setBanDuration(Number(e.target.value))}
          />
        </div>

        <div className="mt-6 w-full flex justify-between">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-red-500 hover:bg-red-400 disabled:bg-gray-400 text-slate-200 py-2 px-4 rounded-lg"
            onClick={handleBan}
            disabled={!bannedReason || banDuration <= 0}
          >
            재재하기
          </button>
        </div>
      </div>
    </div>
  );
}
