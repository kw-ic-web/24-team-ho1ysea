import { PlayerPos } from "@@types/PlayerType";
import { useTick } from "@pixi/react";
import { useRef, useState, useEffect } from "react";

/**
 * @description 캐릭터가 이동 중일 때만 캐릭터 애니메이션을 적용할 수 있도록 frame state를 반환하는 커스텀 훅
 */
export const usePlayerAnimation = (position: PlayerPos) => {
  const [frame, setFrame] = useState<number>(1);
  const lastUpdateTimeRef = useRef<number>(0);
  const lastMovementTimeRef = useRef<number>(Date.now());
  const previousPositionRef = useRef(position);

  useEffect(() => {
    // 위치가 변경되었을 때만 마지막 이동 시간을 업데이트
    const hasPositionChanged =
      position.x !== previousPositionRef.current.x ||
      position.y !== previousPositionRef.current.y;

    if (hasPositionChanged) {
      lastMovementTimeRef.current = Date.now();
      previousPositionRef.current = position;
    }
  }, [position]);

  useTick((deltaTime) => {
    // 최근 이동 시간이 일정 시간(예: 100ms)을 넘지 않으면 애니메이션 적용
    const isMoving = Date.now() - lastMovementTimeRef.current < 100;

    if (!isMoving) {
      setFrame(1); // 움직임이 없으면 기본 프레임으로 설정
      return;
    }

    lastUpdateTimeRef.current += deltaTime * 16.66;

    // 200ms마다 프레임 변경
    if (lastUpdateTimeRef.current >= 200) {
      setFrame((prev) => (prev + 1) % 4);
      lastUpdateTimeRef.current = 0;
    }
  });

  return frame;
};
