import { ObjectPos } from "./GameType";

export type Obstacle = {
  objectId: string;
  obstacleId: string; // 추후 확실한 타입으로 내로잉 ("해파리" | "상어" 이런식으로)
  position: ObjectPos; // { x: number, y:number }
};
