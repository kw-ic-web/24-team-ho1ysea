import { MyItems, StoreItems } from "@@types/itemsType";
import { myCoinApi } from "@apis/coinRestful";
import { allStoreItemsApi, myItemsApi } from "@apis/itemRestful";
import { getLocalStorage } from "@utils/localStorage";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [storeItems, setStoreItems] = useState<StoreItems>([]);
  const [myItems, setMyItems] = useState<MyItems>([]);
  const [myCoin, setMyCoin] = useState(0);

  const handleIncCost = async () => {
    try {
      console.log("클릭");
      const token = getLocalStorage("token");

      // 서버에 요청해 코인을 증가시키는 작업 수행
      await axios.get(`${import.meta.env.VITE_API_URL}/coin/test`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 코인의 최신 상태를 다시 서버에서 가져와 상태에 반영
      const myCoinData = await myCoinApi(token!).then((res) => res.data.coin);
      console.log("최신 코인 값:", myCoinData);

      // 최신 코인 값으로 덮어쓰기
      setMyCoin(myCoinData);
    } catch (err) {
      console.error("코인 갱신 중 오류:", err);
    }
  };

  useEffect(() => {
    const fetchData = async (token: string) => {
      try {
        const storeItemsData = await allStoreItemsApi().then((res) => res.data);
        const myItemsData = await myItemsApi(token).then((res) => res.data);
        const myCoinData = await myCoinApi(token).then((res) => res.data.coin);
        setStoreItems(storeItemsData);
        setMyItems(myItemsData);
        setMyCoin(myCoinData);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err.response);
        }
      }
    };
    const token = getLocalStorage("token");
    if (isOpen) {
      if (token) {
        fetchData(token);
      }
    }
  }, [navigate, isOpen]);

  useEffect(() => {
    console.log(storeItems);
    console.log(myItems);
    console.log(myCoin);
  }, [myCoin, myItems, storeItems]);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
      setActiveTab("buy");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-gray-800 z-50"
      onClick={handleBgClick}
    >
      <div className="bg-slate-200 p-2 m-1 mx-4 w-full max-w-screen-lg flex flex-col justify-center items-center shadow-lg rounded-lg">
        <div className="relative w-full text-center font-bold text-xs sm:text-2xl pt-2 pb-0 mx-auto mb-1">
          <AiFillCloseSquare
            className="absolute top-1.5 p-1 w-7 h-7 sm:w-11 sm:h-11 cursor-pointer hover:text-red-500"
            onClick={() => {
              onClose();
              setActiveTab("buy");
            }}
          />
          <h1>상점</h1>
        </div>
        <button onClick={handleIncCost}>클릭하면 돈오름 ㅋㅋ</button>
        <div className="w-full flex justify-between items-center">
          <div className="mx-2 text-[6px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg">
            <p>코인: {myCoin}</p>
          </div>

          <div className="mx-2 flex justify-around mb-1 rounded-lg shadow-lg text-[6px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg">
            <button
              className={`px-3 py-1 rounded-l-lg ${
                activeTab === "buy"
                  ? "bg-blue-500 text-slate-200"
                  : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("buy")}
            >
              구매
            </button>
            <button
              className={`px-3 py-1 rounded-r-lg ${
                activeTab === "sell"
                  ? "bg-blue-500 text-slate-200"
                  : "bg-gray-300"
              }`}
              onClick={() => setActiveTab("sell")}
            >
              판매
            </button>
          </div>
        </div>

        <div className="flex items-stretch w-full overflow-x-scroll">
          {activeTab === "buy" ? (
            storeItems.map((item) => (
              <div
                className="flex flex-shrink-0 flex-col gap-0.5 md:gap-2 justify-between bg-slate-100 rounded-lg shadow-lg m-2 p-2 w-60"
                key={item.itemId + activeTab}
              >
                <div className="w-full flex justify-center gap-4 items-center">
                  <img
                    src="/images/item_test.png"
                    alt={item.itemName}
                    className="w-8 md:w-12 bg-slate-300 rounded-full p-1"
                  />
                  <p className="text-center font-bold text-xs sm:text-base md:text-lg">
                    {item.itemName}
                  </p>
                </div>

                <p className="hidden sm:block mx-auto text-gray-700 text-[8px] sm:text-sm">
                  {item.description}
                </p>
                <p className="text-blue-400 mx-auto text-[12px] sm:text-sm">
                  {item.price} 원
                </p>

                <button className="text-[8px] md:text-sm block mx-auto w-2/3 py-1.5 px-2 bg-slate-700 text-slate-200 transition-colors rounded-lg hover:bg-slate-600">
                  구매하기
                </button>
              </div>
            ))
          ) : myItems.length !== 0 ? (
            myItems.map((item) => (
              <div
                className="flex flex-shrink-0 flex-col gap-0.5 md:gap-2 justify-between bg-slate-100 rounded-lg shadow-lg m-2 p-2 w-60"
                key={item.itemId + activeTab}
              >
                <div className="w-full flex justify-center gap-4 items-center">
                  <img
                    src="/images/item_test.png"
                    alt={item.itemName}
                    className="w-8 md:w-12 bg-slate-300 rounded-full p-1"
                  />
                  <p className="text-center font-bold text-xs sm:text-base md:text-lg">
                    {item.itemName}
                  </p>
                </div>

                <p className="hidden sm:block mx-auto text-gray-700 text-[8px] sm:text-sm">
                  {item.description}
                </p>
                <p className="mx-auto text-gray-700 text-[8px] sm:text-sm">
                  {item.quantity} 개
                </p>
                <p className="text-blue-400 mx-auto text-[12px] sm:text-sm">
                  {} 원
                </p>

                <button className="text-[8px] md:text-sm block mx-auto w-2/3 py-1.5 px-2 bg-slate-700 text-slate-200 transition-colors rounded-lg hover:bg-slate-600">
                  구매하기
                </button>
              </div>
            ))
          ) : (
            <p className="mx-auto p-4">보유 아이템이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
