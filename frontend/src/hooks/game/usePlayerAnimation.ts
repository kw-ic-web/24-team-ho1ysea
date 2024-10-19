import { useTick } from "@pixi/react";
import { useKeyStore } from "@store/keyStore";
import { isKeyActive } from "@utils/isKeyActive";
import { useRef, useState } from "react";

/**
 * @description 플레이어가 이동 중일 때만 캐릭터 애니메이션을 적용할 수 있도록 frame state를 반환하는 커스텀 훅
 */
export const usePlayerAnimation = () => {
  const { keyState } = useKeyStore();
  const [frame, setFrame] = useState<number>(1);
  const lastUpdateTimeRef = useRef<number>(0);

  useTick((deltaTime) => {
    if (!isKeyActive(keyState)) {
      setFrame(1);
      return;
    }
    lastUpdateTimeRef.current += deltaTime * 16.66;

    // 200까지 누적될 때까지 기다렸다가 프레임 변경
    if (lastUpdateTimeRef.current >= 200) {
      setFrame((prev) => (prev + 1) % 4);
      lastUpdateTimeRef.current = 0;
    }
  });

  return frame;
};
