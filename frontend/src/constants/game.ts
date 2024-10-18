export const WORLD_W = 1280; // 게임 월드 가로 크기
export const WORLD_H = 768; // 게임 월드 세로 크기
export const WORLD_RATIO = WORLD_W / WORLD_H; // 게임 월드 비율 (16:9)

export const PLAYER_MOVE = 20; // 플레이어 이동 단위
export const CHARACTER_W = 460; // cell 가로 크기
export const CHARACTER_H = 600; // cell 세로 크기
export const PLAYER_SIZE_W = CHARACTER_W / 10; // 플레이어 가로 크기
export const PLAYER_SIZE_H = CHARACTER_H / 10; // 플레이어 세로 크기

export const SHOP = {
  x: WORLD_W - 220,
  y: WORLD_H - 190,
  width: 373 * 0.45,
  height: 299 * 0.4,
}; // 상점 위치 관련 정보
