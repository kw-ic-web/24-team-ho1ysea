import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { PlayerInfo } from "@@types/GameType";
import { GameItem } from "@@types/itemsType";
import { Obstacle } from "@@types/obstacleType";
import { Trash } from "@@types/trashType";
import { useGameDataStore } from "@store/gameDataStore";
import { usePlayerStore } from "@store/playerStore";
import { getLocalStorage } from "@utils/localStorage";
import { getItemApi } from "@apis/itemRestful";
import { useToastStore } from "@store/toastStore";
import { useAudio } from "./useAudio";

export const useSocketRecv = (socket: Socket | null) => {
  const userId = useGameDataStore((s) => s.userId); // 플레이어 아이디
  const resetPlayerPos = usePlayerStore((s) => s.resetPlayerPos); // 플레이어 위치를 초기위치로 리셋하는 setter함수
  const toggleConfusionDirection = usePlayerStore(
    (s) => s.toggleConfusionDirection
  ); // 플레이어의 direction을 3초동안 반전시키는 함수
  const setMyTrashAmount = useGameDataStore((s) => s.setMyTrashAmount); // 수집 쓰레기 setter함수
  const fetchMyItems = useGameDataStore((s) => s.fetchMyItems); // 인벤토리 api 호출해서 업데이트하는 setter함수
  const showToast = useToastStore((s) => s.showToast);
  const [anotherPlayersInfo, setAnotherPlayersInfo] = useState<PlayerInfo[]>(
    []
  ); // 플레이어를 제외한 나머지 유저의 정보가 담길 배열 <- 소켓에서 가져오는 데이터를 필터링해서 저장
  const [obstacleInfo, setObstacleInfo] = useState<Obstacle[]>([]); // 방해요소 정보 + 좌표 배열
  const [trashInfo, setTrashInfo] = useState<Trash[]>([]); // 쓰레기 정보 + 좌표 배열
  const [itemInfo, setItemInfo] = useState<GameItem[]>([]); // 아이템 정보 + 좌표 배열

  const playGetSound = useAudio("/sound/get.mp3");
  const playHitSound = useAudio("/sound/hit.mp3");

  useEffect(() => {
    if (socket && userId) {
      socket.on("updateCharacterPosition", (data: PlayerInfo[]) => {
        setAnotherPlayersInfo(data.filter((d) => d.userId !== userId));
      });
      socket.on("generateRandomObstacle", (data: Obstacle[]) => {
        setObstacleInfo(data);
      });
      socket.on("generateRandomItem", (data: GameItem[]) => {
        setItemInfo(data);
      });
      socket.on("generateRandomTrash", (data: Trash[]) => {
        setTrashInfo(data);
      });
      socket.on("collisionTrash", (collisionTrashRes: Trash[]) => {
        setTrashInfo(collisionTrashRes);
        playGetSound(); // 획득 효과음 실행
      });
      socket.on("collisionItem", (collisionItemRes: GameItem[]) => {
        setItemInfo(collisionItemRes);
        playGetSound(); // 획득 효과음 실행
      });
      socket.on("collisionObstacle", (collisionObstacleRes: Obstacle[]) => {
        setObstacleInfo(collisionObstacleRes);
      });
      socket.on("getTrashAmount", (trashAmountRes: number) => {
        setMyTrashAmount(trashAmountRes);
      });
      socket.on("getItem", async (itemId: string) => {
        console.log(`itemId: ${itemId}`);
        try {
          const token = getLocalStorage("token");
          if (token) {
            // 습득한 아이템을 백엔드 mongodb에 업데이트하도록 요청을 날리고
            await getItemApi(token, itemId);
            // 끝나면 인벤토리 내 아이템 정보를 다시 받아와서 zustand state를 업데이트하는 함수 실행
            await fetchMyItems(token);
          }
        } catch (e) {
          console.error("아이템 주운거 처리하다 에러 발생", e);
        }
      });
      socket.on("collisionShark", () => {
        resetPlayerPos(); // 초기위치로 이동시킴
        setMyTrashAmount(0); // 쓰레기를 전부 잃음
        playHitSound(); // 충돌 효과음 실행
        showToast("상어에게 공격받아 수집한 쓰레기를 모두 잃었습니다!!");
      });
      socket.on("collisionJellyfish", (duration: number) => {
        toggleConfusionDirection(duration); // 방향 전환 효과를 duration동안 적용
        playHitSound(); // 충돌 효과음 실행
        showToast(`해파리와 부딧쳐 ${duration / 1000}초 동안 어지러워집니다!!`);
      });
    } else if (!socket) {
      setAnotherPlayersInfo([]);
      setObstacleInfo([]);
      setTrashInfo([]);
      setItemInfo([]);
    }
  }, [
    fetchMyItems,
    playGetSound,
    playHitSound,
    resetPlayerPos,
    setMyTrashAmount,
    showToast,
    socket,
    toggleConfusionDirection,
    userId,
  ]);

  return { anotherPlayersInfo, obstacleInfo, trashInfo, itemInfo };
};
