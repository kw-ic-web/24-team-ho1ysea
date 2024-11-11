import { Trash } from "@@types/trashType";
import { Sprite } from "@pixi/react";

interface Props {
  trash: Trash;
}

export default function RenderTrash({ trash }: Props) {
  const image =
    trash.trashId === "trash001"
      ? "/images/trash/0.png"
      : "/images/trash/1.png";

  return (
    <Sprite
      image={image}
      x={trash.position.x}
      y={trash.position.y}
      scale={0.4}
    />
  );
}
