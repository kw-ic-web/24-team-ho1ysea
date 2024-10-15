import { useItemKeyListener } from "@hooks/game/useItemKeyListener";

export default function ItemInventory(): JSX.Element {
  // 추후 API로 받아오는 데이터로 교체
  const mockData = [
    { itemName: "이름", image: "주소", itemCount: 2 },
    { itemName: "이름", image: "주소", itemCount: 4 },
    { itemName: "이름", image: "주소", itemCount: 1 },
    { itemName: "이름", image: "주소", itemCount: 3 },
    { itemName: "이름", image: "주소", itemCount: 2 },
  ];

  const activeItem = useItemKeyListener();

  return (
    <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-slate-200">
      {mockData.map((data, idx) => (
        <div
          className={`flex justify-center items-center relative w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 ${
            activeItem === idx + 1
              ? "border-yellow-400 border-2"
              : "border-[0.8px]"
          }`}
        >
          <div className="p-1">
            <img src="/images/item_test.png" />
          </div>
          {/* 아이템 사용 단축키가 들어갈 p 태그 */}
          <p className="font-semibold absolute left-0.5 bottom-0.5 text-[5px] sm:text-[10px] md:text-[15px] lg:text-[20px] lg:left-1 lg:bottom-1">
            {idx + 1}
          </p>
          {/* 아이템 보유 개수가 들어갈 p 태그 */}
          <p className="absolute right-0.5 bottom-0.5 text-[3px] sm:text-[6px] md:text-[10px] lg:text-[17px] lg:right-1 lg:bottom-1">
            {data.itemCount}
          </p>
        </div>
      ))}
    </div>
  );
}
