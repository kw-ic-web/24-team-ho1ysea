import { utilizeItemApi } from "@apis/itemRestful";
import { TOTAL_INVENTORY_SLOT } from "@constants/game";
import { useGameDataStore } from "@store/gameDataStore";
import { useKeyStore } from "@store/keyStore";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useMemo } from "react";

export default function ItemInventory(): JSX.Element {
  const myItems = useGameDataStore((s) => s.myItems);
  const activeItem = useKeyStore((s) => s.activeItem);
  const fetchMyItems = useGameDataStore((s) => s.fetchMyItems);
  const showToast = useToastStore((s) => s.showToast);

  // 인벤토리 슬롯을 항상 유지하기 위해서 TOTAL_INVENTORY_SLOT 만큼의 배열을 만들고, 내부에 아이템을 채움 -> 아이템 없으면 null 남음
  const itemSlots = useMemo(() => {
    return new Array(TOTAL_INVENTORY_SLOT).fill(null).map((_, i) => myItems[i]);
  }, [myItems]);

  useEffect(() => {
    const utilizeItem = async () => {
      try {
        if (activeItem) {
          const token = getLocalStorage("token");
          if (token) {
            const { data } = await utilizeItemApi(
              token,
              itemSlots[activeItem - 1].itemId
            );
            console.log(data);
            await fetchMyItems(token);
            showToast(`${itemSlots[activeItem - 1].itemName} 사용 완료!`);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    utilizeItem();
  }, [activeItem, fetchMyItems, showToast]);

  return (
    <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-slate-200">
      {itemSlots.map((item, idx) => (
        <div
          className={`flex justify-center items-center relative w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 ${
            activeItem === idx + 1
              ? "border-yellow-400 border-2"
              : "border-[0.8px]"
          }`}
          key={idx}
        >
          {item ? (
            <>
              <div className="p-1">
                <img src={`/images/items/${item.image}`} />
              </div>
              {/* 아이템 사용 단축키가 들어갈 p 태그 */}
              <p className="font-semibold absolute left-0.5 bottom-0.5 text-[5px] sm:text-[10px] md:text-[15px] lg:text-[20px] lg:left-1 lg:bottom-1">
                {idx + 1}
              </p>
              {/* 아이템 보유 개수가 들어갈 p 태그 */}
              <p className="absolute right-0.5 bottom-0.5 text-[3px] sm:text-[6px] md:text-[10px] lg:text-[17px] lg:right-1 lg:bottom-1">
                {item.quantity}
              </p>
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
    </div>
  );
}
