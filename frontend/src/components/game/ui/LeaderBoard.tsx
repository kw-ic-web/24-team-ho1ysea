import { TopUser } from "@@types/GameType";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  isJoinGameRoom: boolean;
  socket: Socket | null;
}

export default function LeaderBoard({ isJoinGameRoom, socket }: Props) {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);

  useEffect(() => {
    if (socket) {
      socket.on("getLeaderBoard", (data: TopUser[]) => {
        setTopUsers(data);
        console.log(data);
      });
    }
  }, [socket]);

  if (!isJoinGameRoom) return null;

  return (
    <div className="absolute rounded bg-black bg-opacity-30 text-white text-xs p-2 top-4 right-4 w-40 shadow-md">
      <div className="mb-2 font-medium text-center border-b border-white pb-1">
        리더보드
      </div>
      <ul className="space-y-1">
        {topUsers.map(({ userId, trashAmount }, idx) => (
          <li
            key={idx}
            className="flex justify-between text-sm py-1 px-2 bg-gray-800 rounded"
          >
            <span>{userId}</span>
            <span>{trashAmount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
