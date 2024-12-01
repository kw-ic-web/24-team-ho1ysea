import { useItemStore } from "@hooks/game/useItemStore";
import { useModalStore } from "@store/modalStore";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { BsCoin, BsTrash } from "react-icons/bs";
import { CgArrowsExchange } from "react-icons/cg";

export default function StoreModal() {
  const { isOpen, toggleModal } = useModalStore();
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const {
    storeItems,
    myItems,
    myCurrency,
    handleBuyItem,
    handleSellItem,
    handleTrashExchange,
  } = useItemStore(isOpen.store);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal("store");
      setActiveTab("buy");
    }
  };

  if (!isOpen.store) return null;

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
              toggleModal("store");
              setActiveTab("buy");
            }}
          />
          <h1>상점</h1>
        </div>

        <div className="w-full mt-4 flex justify-between items-center">
          <div className="flex justify-center items-center gap-1 md:gap-2 mx-2 text-[6px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg">
            <div className="flex justify-center items-center">
              <BsCoin />: {myCurrency.coin}
            </div>
            <button
              onClick={handleTrashExchange}
              className="flex justify-center items-center gap-1 px-1 py-0.5 mx-1 my-0.5 bg-slate-700 text-slate-200 transition-colors hover:bg-slate-600 rounded-lg text-[6px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base"
            >
              <CgArrowsExchange /> 환전
            </button>
            <div>
              <div className="flex justify-center items-center">
                <BsTrash />: {myCurrency.trash}
              </div>
            </div>
          </div>

          <div className="mx-2 flex justify-around mb-1 rounded-lg shadow-lg text-[6px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base">
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
                    src={`/images/items/${item.image}`}
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

                <button
                  onClick={() => handleBuyItem(item)}
                  className="text-[8px] md:text-sm block mx-auto w-2/3 py-1.5 px-2 bg-slate-700 text-slate-200 transition-colors rounded-lg hover:bg-slate-600"
                >
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
                    src={`/images/items/${item.image}`}
                    alt={item.itemName}
                    className="w-8 md:w-12 bg-slate-300 rounded-full p-1"
                  />
                  <p className="text-center font-bold text-xs sm:text-base md:text-lg">
                    {item.itemName} ({item.quantity}개)
                  </p>
                </div>

                <p className="hidden sm:block mx-auto text-gray-700 text-[8px] sm:text-sm">
                  {item.description}
                </p>
                <p className="text-blue-400 mx-auto text-[12px] sm:text-sm">
                  {} 원
                </p>

                <button
                  onClick={() => handleSellItem(item)}
                  className="text-[8px] md:text-sm block mx-auto w-2/3 py-1.5 px-2 bg-slate-700 text-slate-200 transition-colors rounded-lg hover:bg-slate-600"
                >
                  판매하기
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
