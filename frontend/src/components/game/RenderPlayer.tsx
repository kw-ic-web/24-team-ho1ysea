import * as PIXI from "pixi.js";
import { PlayerPos } from "@@types/PlayerType";
import { useEffect, useState } from "react";
import { CHARACTER_H, CHARACTER_W } from "@constants/game";
import { Sprite } from "@pixi/react";

interface Props {
  playerPos: PlayerPos;
}

const baseTexture = PIXI.BaseTexture.from("/images/character.png");

function RenderPlayer({ playerPos }: Props) {
  const { x, y, direction } = playerPos;
  const [frame, setFrame] = useState(0);
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
