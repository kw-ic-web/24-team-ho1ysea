import { SHOP } from "@constants/game";
import { Sprite } from "@pixi/react";
import React from "react";

function RenderMap() {
  return (
    <>
      <Sprite image="/images/map.png" x={0} y={0} />
      <Sprite image="/images/shop.png" x={SHOP.x} y={SHOP.y} scale={0.4} />
    </>
  );
}

export default React.memo(RenderMap);
