import { ObjectPos } from "./GameType";

export type Obstacle = {
  objectId: string;
  obstacleId: "obstacle001" | "obstacle002";
  position: ObjectPos; // { x: number, y:number }
  isActive: 0 | 1;
};
