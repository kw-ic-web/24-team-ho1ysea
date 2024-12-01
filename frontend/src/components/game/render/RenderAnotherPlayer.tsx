import * as PIXI from "pixi.js";
import { PlayerInfo } from "@@types/GameType";
import { usePlayerAnimation } from "@hooks/game/usePlayerAnimation";
import { useEffect, useState } from "react";
import { CHARACTER_H, CHARACTER_W } from "@constants/game";
import { Sprite, Text } from "@pixi/react";

const baseTexture = PIXI.BaseTexture.from("/images/character.png");

interface Props {
  anotherPlayerInfo: PlayerInfo;
}

function RenderAnotherPlayer({ anotherPlayerInfo }: Props) {
  const { x, y, direction } = anotherPlayerInfo.position;
  const frame = usePlayerAnimation(anotherPlayerInfo.position);
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

  return (
    <>
      <Text
        text={anotherPlayerInfo.nickName}
        x={x + 10}
        y={y - 20}
        anchor={0.5}
        style={new PIXI.TextStyle({ align: "center" })}
      />
      <Sprite
        texture={texture}
        x={x}
        y={y}
        scale={0.1}
        interactive={true}
        pointerdown={() => console.log("클릭")}
      />
    </>
  );
}

export default RenderAnotherPlayer;
