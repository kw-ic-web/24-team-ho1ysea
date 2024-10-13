import { useIdCheck } from "@hooks/landing/useIdCheck";
import { usePasswordCheck } from "@hooks/landing/usePasswordCheck";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

interface Props {
  onPrevClick: () => void;
  onLoginClick: () => void;
}

export default function RegisterModal({ onPrevClick, onLoginClick }: Props) {
  // 입력 field state
  const [userName, setUserName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<string>("");

  // 비밀번호 검증
  const { isPwCheck, pwMsg } = usePasswordCheck(password, checkPassword);

  // 아이디 검증
  const { isIdCheck, idMsg, handleIdCheckClick } = useIdCheck(id);

  // 회원가입 버튼 활성화 / 비활성화
  const [isAbleSubmit, setIsAbleSubmit] = useState<boolean>(false);

  const onSubmit = () => {
    console.log("회원가입 버튼 클릭");
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 버블링으로 인해, target과 currentTarget을 비교하지 않으면
    // 모달 내 어떤 요소를 눌러도 모달창이 닫힌다.
    if (e.target === e.currentTarget) {
      onPrevClick();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBgClick}
    >
      <div className="bg-sky-50 text-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <AiFillCloseSquare
          size={30}
          className=" hover:text-red-500"
          onClick={onPrevClick}
        />
        <div className="text-xl font-semibold text-center mb-6">회원가입</div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Your name"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your nickname"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
          />
          <div className="flex relative">
            <input
              type="text"
              autoComplete="username"
              placeholder="ID"
              className="w-full h-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <button
              className="absolute right-0 p-[10.5px] border-slate-700 bg-slate-700 text-slate-200 transition-colors rounded-r-lg hover:bg-slate-600"
              onClick={handleIdCheckClick}
            >
              ID 확인
            </button>
          </div>
          <div className="flex justify-end items-center mb-4">
            <p
              className={`w-fit text-end ${
                isIdCheck ? "text-green-500" : "text-red-500"
              }`}
            >
              {idMsg}
            </p>
          </div>

          <input
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Check again password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <div className="flex justify-end items-center mb-4">
            <p
              className={`w-fit text-end ${
                isPwCheck ? "text-green-500" : "text-red-500"
              }`}
            >
              {pwMsg}
            </p>
          </div>

          <input
            type="submit"
            value="회원가입"
            onClick={onSubmit}
            disabled={!isAbleSubmit}
            className="w-full font-semibold bg-blue-500 disabled:bg-gray-500 text-sky-100 p-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          />
        </form>
        <div className="flex justify-end items-center">
          <p
            className="text-blue-500 hover:text-blue-600 w-fit cursor-pointer text-end mt-1 p-1"
            onClick={onLoginClick}
          >
            로그인하기
          </p>
        </div>
      </div>
    </div>
  );
}
