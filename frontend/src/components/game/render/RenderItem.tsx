import { GameItem } from "@@types/itemsType";
import { Sprite } from "@pixi/react";

interface Props {
  item: GameItem;
}

export default function RenderItem({ item }: Props) {
  return (
    <Sprite
      image={`/images/items/${item.image}`}
      x={item.position.x}
      y={item.position.y}
      scale={0.1}
    />
  );
}
