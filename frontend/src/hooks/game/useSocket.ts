import { useGameDataStore } from "@store/gameDataStore";
import { usePlayerStore } from "@store/playerStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const [isJoinGameRoom, setIsJoinGameRoom] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const userId = useGameDataStore((s) => s.userId);
  const playerY = usePlayerStore((s) => s.playerPos.y);
  const resetPlayerPos = usePlayerStore((s) => s.resetPlayerPos);

  // 초기 소켓을 연결하고, 페이지가 언마운트되면 소켓 연결을 끊기 위한 effect
  useEffect(() => {
    if (!socketRef.current && userId) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
      });
    }

    // 컴포넌트 언마운트 클린업
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
      resetPlayerPos(); // 게임 페이지가 닫히면, 플레이어 위치도 해변으로 초기화
    };
  }, [resetPlayerPos, userId]);

  // 플레이어의 좌표에 따라 룸에 입장하거나 퇴장하도록 하는 effect
  useEffect(() => {
    if (playerY >= 500 && socketRef.current && isJoinGameRoom) {
      socketRef.current.emit("leaveGame", userId);
      setIsJoinGameRoom(false);
    } else if (playerY < 500 && socketRef.current && !isJoinGameRoom) {
      socketRef.current.emit("joinGame", userId);
      setIsJoinGameRoom(true);
    }
  }, [isJoinGameRoom, playerY, userId]);

  return { isJoinGameRoom, socketRef };
};
