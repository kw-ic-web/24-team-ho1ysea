export type Users = {
  userId: string;
  nickName: string;
  countPlay: number;
}[];

export type TrashSpeed = {
  message?: string;
  speed: number;
};

export type TrashLimit = {
  message?: string;
  quantity: number;
};
