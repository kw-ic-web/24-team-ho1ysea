export type PlayerInfo = {
  userId: string;
  nickName: string;
  position: PlayerPos;
};

export type PlayerPos = {
  x: number;
  y: number;
  direction: "up" | "right" | "bottom" | "left";
};

export type ObjectPos = {
  x: number;
  y: number;
};

export type TopUser = {
  userId: string;
  nickName: string;
  trashAmount: number;
};
