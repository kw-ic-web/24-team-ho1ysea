import { WORLD_H, WORLD_RATIO, WORLD_W } from "@constants/game";
import { useCallback, useEffect, useState } from "react";

/**
 * @description pixi.js APP 크기를 브라우저 창 크기가 아닌 논리적 크기로 매치시키기 위한 훅
 * @returns viewportSize.width와 viewportSize.height를 Stage의 styles 내 width, height로 전달
 */
export const useStageInit = (): {
  width: number;
  height: number;
} => {
  const [viewportSize, setViewportSize] = useState({
    width: WORLD_W,
    height: WORLD_H,
  });

  /**
   * @description 브라우저의 가로 세로 크기와, 게임 월드의 논리적 가로 세로 크기를 고려하여 pixi.js Stage를 세팅하는 함수
   */
  const handleViewportSize = useCallback(() => {
    console.log("setViewportSize 실행");
    const vw = window.innerWidth; // 브라우저의 현재 너비
    const vh = window.innerHeight; // 브라우저의 현재 높이
    let newWidth, newHeight;

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

    setViewportSize({
      width: newWidth,
      height: newHeight,
    });
  }, []);

  // 마운트 시 함수 실행 후 이벤트 리스너 연결, 언마운트 시 이벤트 리스너 제거
  useEffect(() => {
    handleViewportSize();
    window.addEventListener("resize", handleViewportSize);
    console.log("리사이즈 이벤트 리스너 연결");
    return () => {
      window.removeEventListener("resize", handleViewportSize);
      console.log("리사이즈 이벤트 리스너 연결 해제");
    };
  }, [handleViewportSize]);

  return viewportSize;
};
