import React from "react";
import { Link } from "react-router-dom";

interface Props {
  compSelector: "viewUsers" | "editSetting";
  setCompSelector: React.Dispatch<
    React.SetStateAction<"viewUsers" | "editSetting">
  >;
}

export default function AdminHeader({ compSelector, setCompSelector }: Props) {
  return (
    <header className="w-full p-4 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">바다 이야기 Admin</h1>
        <ul className="flex space-x-6">
          <li
            className="hover:text-gray-400 transition-colors cursor-pointer"
            onClick={() =>
              compSelector === "viewUsers"
                ? setCompSelector("editSetting")
                : setCompSelector("viewUsers")
            }
          >
            {compSelector === "viewUsers"
              ? "게임 설정 변경하기"
              : "전체 유저 정보 확인"}
          </li>
          <li>
            <Link
              to="/game"
              className="p-2 hover:text-gray-400 transition-colors"
            >
              게임으로 돌아가기
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
