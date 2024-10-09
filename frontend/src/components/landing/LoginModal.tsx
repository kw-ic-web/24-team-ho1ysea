import { AiFillCloseSquare } from "react-icons/ai";

interface Props {
  onPrevClick: () => void;
  onRegisterClick: () => void;
}

export default function LoginModal({ onPrevClick, onRegisterClick }: Props) {
  const onSubmit = () => {
    console.log("로그인 버튼 클릭");
    return;
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
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <AiFillCloseSquare
          size={30}
          className=" hover:text-red-500"
          onClick={onPrevClick}
        />
        <div className="text-xl font-semibold text-center mb-6">로그인</div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            autoComplete="username"
            placeholder="ID"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="submit"
            value="로그인"
            onClick={onSubmit}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          />
        </form>
        <div className="flex justify-end items-center">
          <p
            className="text-blue-500 hover:text-blue-600 w-fit cursor-pointer text-end mt-1 p-1"
            onClick={onRegisterClick}
          >
            회원가입하기
          </p>
        </div>
      </div>
    </div>
  );
}
