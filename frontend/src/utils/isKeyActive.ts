import { KeyState } from "@@types/PlayerType";

export const isKeyActive = (keyState: KeyState) =>
  keyState.isTop || keyState.isRight || keyState.isBottom || keyState.isLeft;
