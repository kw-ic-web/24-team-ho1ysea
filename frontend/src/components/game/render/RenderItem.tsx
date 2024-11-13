import { GameItem } from "@@types/itemsType";
import { Sprite } from "@pixi/react";

interface Props {
  item: GameItem;
}

export default function RenderItem({ item }: Props) {
  const image =
    item.itemId === "item001"
      ? "/images/items/dipNet.png"
      : "/images/items/flipper.png";

  return (
    <Sprite image={image} x={item.position.x} y={item.position.y} scale={0.1} />
  );
}
