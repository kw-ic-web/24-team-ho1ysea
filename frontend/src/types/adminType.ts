export type User = {
  userId: string;
  nickName: string;
  countPlay: number;
  reportCount: number;
};

export type BannedUser = {
  userId: string;
  nickName: string;
  freedomAt: string;
};

export type Report = {
  userId: string;
  nickName: string;
  reportCount: number;
};

export type TrashSpeed = {
  message?: string;
  speed: number;
};

export type TrashLimit = {
  message?: string;
  quantity: number;
};
