import { useGameDataStore } from "@store/gameDataStore";
import { usePlayerStore } from "@store/playerStore";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const userId = useGameDataStore((s) => s.userId);
  const playerY = usePlayerStore((s) => s.playerPos.y);

  useEffect(() => {
    if (isConnected && playerY >= 500) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    } else if (!isConnected && playerY < 500) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
        query: { userId },
      });
      setIsConnected(true);
    }
  }, [isConnected, playerY, userId]);

  return socketRef;
};
