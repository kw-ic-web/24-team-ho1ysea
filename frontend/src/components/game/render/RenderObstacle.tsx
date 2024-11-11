import { Obstacle } from "@@types/obstacleType";
import { AnimatedSprite } from "@pixi/react";
import * as PIXI from "pixi.js";
import { useMemo } from "react";

interface Props {
  obstacle: Obstacle;
}

// 해파리, 상어 등 방해요소를 렌더링하는 컴포넌트
export default function RenderObstacle({ obstacle }: Props) {
  const jellyfishFrames = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) =>
      PIXI.Texture.from(`/images/obstacle/jellyfish/${i}.png`)
    );
  }, []);

  const sharkFrames = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) =>
      PIXI.Texture.from(`/images/obstacle/shark/${i}.png`)
    );
  }, []);

  const frames =
    obstacle.obstacleId === "obstacle001" ? sharkFrames : jellyfishFrames;

  return (
    <AnimatedSprite
      textures={frames}
      isPlaying={true}
      animationSpeed={0.25}
      initialFrame={0}
      loop={true}
      anchor={0.5}
      scale={0.5}
      x={obstacle.position.x}
      y={obstacle.position.y}
    />
  );
}
