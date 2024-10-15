import { useEffect, useState } from "react";

export const useItemKeyListener = () => {
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key >= "1" && e.key <= "5") {
      setActiveItem(Number(e.key));
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key >= "1" && e.key <= "5") {
      setActiveItem(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return activeItem;
};
