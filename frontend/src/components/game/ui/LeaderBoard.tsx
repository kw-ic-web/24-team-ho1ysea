import { TopUser } from "@@types/GameType";
import { useGameDataStore } from "@store/gameDataStore";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  isJoinGameRoom: boolean;
  socket: Socket | null;
}

export default function LeaderBoard({ isJoinGameRoom, socket }: Props) {
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const myNickName = useGameDataStore((s) => s.nickName);
  const myTrash = useGameDataStore((s) => s.myCurrency.trash);

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
    <div className="absolute rounded bg-black bg-opacity-30 text-white p-2 top-4 right-4 w-40 shadow-md">
      <div className="mb-2 pb-2 font-medium text-center border-b border-white">
        순위
      </div>
      <ul className="space-y-1">
        {topUsers.map(({ nickName, trashAmount }, idx) => (
          <li
            key={idx}
            className="flex justify-between text-sm py-1 px-2 bg-gray-800 rounded"
          >
            <span>{nickName}</span>
            <span>{trashAmount}</span>
          </li>
        ))}
        {!topUsers.some(({ nickName }) => nickName === myNickName) && (
          <li className="flex justify-between text-sm py-1 px-2 bg-gray-800 rounded">
            <span>{myNickName}</span>
            <span>{myTrash}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
