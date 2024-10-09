import { useCanvasInit } from "@hooks/useCanvasInit";

export default function GamePage() {
  const canvasRef = useCanvasInit();

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          margin: "0 auto",
          border: "solid 1px black",
        }}
      >
        CANVAS가 지원되는 브라우저를 사용하세요
      </canvas>
    </div>
  );
}
