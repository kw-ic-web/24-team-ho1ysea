import { Obstacle } from "@@types/obstacleType";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useMemo } from "react";

interface Props {
  obstacle: Obstacle;
}

// 해파리, 상어 등이 등장하기 전에 경고
export default function RenderWarning({ obstacle }: Props) {
  const warningFrames = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) =>
      PIXI.Texture.from(`/images/warning/${i}.png`)
    );
  }, []);

  return (
    <AnimatedSprite
      textures={warningFrames}
      isPlaying={true}
      animationSpeed={0.25}
      initialFrame={0}
      loop={true}
      anchor={0.5}
      scale={1.5}
      x={obstacle.position.x}
      y={obstacle.position.y}
    />
  );
}
