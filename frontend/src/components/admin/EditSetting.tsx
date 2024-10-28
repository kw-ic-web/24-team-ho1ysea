import {
  getTrashLimitApi,
  getTrashSpeedApi,
  setTrashLimitApi,
  setTrashSpeedApi,
} from "@apis/adminRestful";
import Loading from "@components/common/Loading";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

export default function EditSetting() {
  const showToast = useToastStore((state) => state.showToast);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [trashSpeed, setTrashSpeed] = useState<number>(0);
  const [trashLimit, setTrashLimit] = useState<number>(0);
  const [initState, setInitState] = useState<{
    speed: number;
    limit: number;
  }>({ speed: 0, limit: 0 });

  const updateGameSetting = async () => {
    const token = getLocalStorage("token");
    if (!token) return;
    if (trashSpeed <= 0 || trashLimit <= 0) {
      showToast("올바른 값을 입력 후 다시 시도해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const [speedRes, limitRes] = await Promise.all([
        setTrashSpeedApi(token, trashSpeed).then((res) => res.data.speed),
        setTrashLimitApi(token, trashLimit).then((res) => res.data.quantity),
      ]);
      setIsLoading(false);
      showToast("게임 설정 업데이트 완료.");
      setInitState({ speed: speedRes, limit: limitRes });
    } catch (err) {
      setIsLoading(false);
      console.error("updateGameSetting 실패", err);
      showToast("게임 설정 업데이트 실패. 잠시 후 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const fetch = async (token: string) => {
      try {
        setIsLoading(true);
        const [speedRes, limitRes] = await Promise.all([
          getTrashSpeedApi(token).then((res) => res.data.speed),
          getTrashLimitApi(token).then((res) => res.data.quantity),
          new Promise((resolve) => setTimeout(resolve, 200)), // 최소 로딩 대기시간
        ]);
        setIsLoading(false);
        setTrashSpeed(speedRes);
        setTrashLimit(limitRes);
        setInitState({ speed: speedRes, limit: limitRes });
      } catch (err) {
        setIsLoading(false);
        console.error("initialize fetch 실패(EditSetting) ", err);
      }
    };

    const token = getLocalStorage("token");
    if (token) {
      fetch(token);
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-6 text-gray-600">
      <Loading isLoading={isLoading} />
      <h1 className="text-2xl font-bold mb-6">게임 설정 변경</h1>
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
          <label className="font-semibold text-lg text-gray-700">
            쓰레기 생성 속도 (초)
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={trashSpeed}
            onChange={(e) => setTrashSpeed(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center">
            {trashSpeed === 0
              ? "쓰레기 생성 속도 초기값을 지정해주세요."
              : `${trashSpeed} 초마다 쓰레기가 생성됩니다.`}
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg shadow-md">
          <label className="font-semibold text-lg text-gray-700">
            쓰레기 최대량
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={trashLimit}
            onChange={(e) => setTrashLimit(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-center">
            {trashLimit === 0
              ? "쓰레기 최대량 초기값을 지정해주세요."
              : `최대 ${trashLimit}개의 쓰레기가 존재할 수 있습니다.`}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={updateGameSetting}
            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 dis text-white font-semibold py-2 px-6 rounded"
            disabled={
              initState !== null &&
              initState.limit === trashLimit &&
              initState.speed === trashSpeed
            }
          >
            설정 변경 완료
          </button>
        </div>
      </div>
    </div>
  );
}
