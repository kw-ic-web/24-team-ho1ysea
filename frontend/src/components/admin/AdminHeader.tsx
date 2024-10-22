import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <header className="w-full p-4 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">바다 이야기 Admin</h1>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/game"
              className="p-2 hover:text-gray-400 transition-colors"
            >
              게임 페이지로 돌아가기
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
