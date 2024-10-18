import { PlayerPos } from "@@types/PlayerType";
import { useEffect, useRef, useState } from "react";

export const usePlayerAnimation = (playerPos: PlayerPos) => {
  const [frame, setFrame] = useState<number>(1);
  const previousPosRef = useRef<PlayerPos>(playerPos); // 플레이어 이전 위치 추적
  const lastUpdateTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null); // RAF ID 추적

  useEffect(() => {
    const isMoving =
      previousPosRef.current.x !== playerPos.x ||
      previousPosRef.current.y !== playerPos.y;

    previousPosRef.current = playerPos;

    // 이동하고 있지 않은 경우
    if (!isMoving) {
      setFrame(1); // 캐릭터 프레임을 서있는걸로 변경
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current); // 등록된 애니메이션 취소
      }
      return;
    }

    // 이동 중인 경우
    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastUpdateTimeRef.current;
      // 200ms 지난 뒤에만 애니메이션 업데이트
      if (elapsed > 200) {
        setFrame((prev) => (prev + 1) % 4);
        lastUpdateTimeRef.current = timestamp; // 마지막 업데이트 시간 갱신
      }
      rafIdRef.current = requestAnimationFrame(animate);
    };
    rafIdRef.current = requestAnimationFrame(animate);

    // 애니메이션 예약 클린업
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [playerPos]);

  return frame;
};
