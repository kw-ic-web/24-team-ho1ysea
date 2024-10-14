import { useItemKeyListener } from "@hooks/game/useItemKeyListener";

export default function ItemInventory() {
  const activeItem = useItemKeyListener();

  return (
    <div className="flex absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-40 text-slate-100">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          className={`flex justify-center items-center relative w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 ${
            activeItem === item
              ? "border-yellow-400 border-2"
              : "border-[0.8px]"
          }`}
        >
          <div className="p-1">
            <img src="/images/item_test.png" />
          </div>
          <p className="font-semibold absolute left-0.5 bottom-0.5 text-[5px] sm:text-[10px] md:text-[15px] lg:text-[20px] lg:left-1 lg:bottom-1">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}
