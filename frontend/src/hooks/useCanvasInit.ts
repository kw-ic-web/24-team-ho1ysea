import { WORLD_H, WORLD_RATIO, WORLD_W } from "@constants/game";
import { useCallback, useEffect, useRef } from "react";

/**
 * @description canvas의 크기를 브라우저 창 크기가 아닌 논리적 크기로 매치시키기 위한 훅
 * @returns <canvas>의 ref에 연결하세요
 */
export const useCanvasInit = (): React.RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /**
   * @description 브라우저의 가로 세로 크기와, 게임 월드의 논리적 가로 세로 크기를 고려하여 canvas를 세팅하는 함수
   */
  const setViewportSize = useCallback(() => {
    console.log("setViewportSize 실행");
    const vw = window.innerWidth; // 브라우저의 현재 너비
    const vh = window.innerHeight; // 브라우저의 현재 높이
    let newWidth, newHeight;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 브라우저 비율과 게임 월드 비율 비교 -> 화면에 다 담길 수 있는 크기 계산
    if (vw / vh > WORLD_RATIO) {
      // 브라우저가 게임 월드 비율보다 더 넓을 경우, 높이를 기준으로 너비를 계산
      newHeight = vh;
      newWidth = vh * WORLD_RATIO;
    } else {
      // 브라우저가 게임 월드 비율보다 더 좁을 경우, 너비를 기준으로 높이를 계산
      newWidth = vw;
      newHeight = vw / WORLD_RATIO;
    }

    // 논리적 게임 월드 크기 설정 (실제 게임 좌표계는 1280x720)
    canvas.width = WORLD_W;
    canvas.height = WORLD_H;

    // 실제 브라우저 화면에서 비율 맞춤
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    canvas.style.position = "absolute";
    canvas.style.left = `${(vw - newWidth) / 2}px`;
    canvas.style.top = `${(vh - newHeight) / 2}px`;

    // 게임 배경 조절
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  }, []);

  // 마운트 시 함수 실행 후 이벤트 리스너 연결, 언마운트 시 이벤트 리스너 제거
  useEffect(() => {
    setViewportSize();
    window.addEventListener("resize", setViewportSize);
    console.log("리사이즈 이벤트 리스너 연결");
    return () => {
      window.removeEventListener("resize", setViewportSize);
      console.log("리사이즈 이벤트 리스너 연결 해제");
    };
  }, [setViewportSize]);

  return canvasRef;
};
