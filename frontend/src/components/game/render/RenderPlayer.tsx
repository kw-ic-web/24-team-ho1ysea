import * as PIXI from "pixi.js";
import { useEffect, useState } from "react";
import { CHARACTER_H, CHARACTER_W } from "@constants/game";
import { Sprite } from "@pixi/react";
import { usePlayerAnimation } from "@hooks/game/usePlayerAnimation";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { usePlayerStore } from "@store/playerStore";

const baseTexture = PIXI.BaseTexture.from("/images/character.png");

/**
 * @description 플레이어 캐릭터를 렌더링하는 컴포넌트
 */
function RenderPlayer() {
  usePlayerPos();

  const { playerPos } = usePlayerStore();
  const frame = usePlayerAnimation();
  const { x, y, direction } = playerPos;

  const [texture, setTexture] = useState<PIXI.Texture | null>(null);

  useEffect(() => {
    let row: number;

    if (direction === "up") {
      row = 3;
    } else if (direction === "right") {
      row = 1;
    } else if (direction === "bottom") {
      row = 0;
    } else {
      row = 2;
    }

    const rect = new PIXI.Rectangle(
      frame * CHARACTER_W,
      row * CHARACTER_H,
      CHARACTER_W,
      CHARACTER_H
    );

    const newTexture = new PIXI.Texture(baseTexture, rect);
    setTexture(newTexture);
  }, [direction, frame]);

  if (!texture) return null;

  return <Sprite texture={texture} x={x} y={y} scale={0.1} />;
}

export default RenderPlayer;
