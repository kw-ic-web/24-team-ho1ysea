import { useEffect, useState } from "react";

export const useItemKeyListener = (isListen: boolean) => {
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
    if (isListen) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isListen]);

  return activeItem;
};
