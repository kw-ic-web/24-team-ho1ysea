import * as PIXI from "pixi.js";
import { useEffect, useState } from "react";
import { CHARACTER_H, CHARACTER_W } from "@constants/game";
import { Sprite, Text } from "@pixi/react";
import { usePlayerAnimation } from "@hooks/game/usePlayerAnimation";
import { usePlayerPos } from "@hooks/game/usePlayerPos";
import { usePlayerStore } from "@store/playerStore";
import { Socket } from "socket.io-client";
import { useGameDataStore } from "@store/gameDataStore";

const baseTexture = PIXI.BaseTexture.from("/images/character.png");

interface Props {
  socket: Socket | null;
}

/**
 * @description 플레이어 캐릭터를 렌더링하는 컴포넌트
 */
function RenderPlayer({ socket }: Props) {
  const [playerSpeed, setPlayerSpeed] = useState<number>(5);
  const playerPos = usePlayerStore((s) => s.playerPos);
  const nickName = useGameDataStore((s) => s.nickName);
  const userId = useGameDataStore((s) => s.userId);

  const frame = usePlayerAnimation(playerPos);
  const { x, y, direction } = playerPos;

  const [texture, setTexture] = useState<PIXI.Texture | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on("getPlayerSpeed", (speed: number) => {
        console.log("getPlayerSpeed: ", speed);
        setPlayerSpeed(speed);
      });
    }
  }, [socket]);

  usePlayerPos(playerSpeed);

  useEffect(() => {
    if (socket && nickName && playerPos) {
      // 플레이어의 좌표가 바뀔 때마다 서버로 emit
      socket.emit("getMyPosition", { userId, nickName, position: playerPos });
    }
  }, [nickName, playerPos, socket, userId]);

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
        text={nickName}
        x={x + 10}
        y={y - 20}
        anchor={0.5}
        style={new PIXI.TextStyle({ align: "center" })}
      />
      <Sprite texture={texture} x={x} y={y} scale={0.1} />
    </>
  );
}

export default RenderPlayer;
