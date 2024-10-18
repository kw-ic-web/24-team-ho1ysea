export type PlayerPos = {
  x: number;
  y: number;
  direction: "up" | "right" | "bottom" | "left";
};

export type KeyState = {
  isLeft: boolean;
  isRight: boolean;
  isTop: boolean;
  isBottom: boolean;
};
