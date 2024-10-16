import { loginApi } from "@apis/userRestful";
import Loading from "@components/common/Loading";
import { setLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Props {
  onPrevClick: () => void;
  onRegisterClick: () => void;
}

export default function LoginModal({ onPrevClick, onRegisterClick }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputs, setInputs] = useState({
    id: "",
    pw: "",
  });

  const onSubmit = () => {
    if (!inputs.id) {
      alert("아이디를 입력해주세요");
      return;
    }
    if (!inputs.pw) {
      alert("비밀번호를 입력해주세요");
      return;
    }
    setIsLoading(true);
    loginApi(inputs.id, inputs.pw)
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        if (res.status === 200) {
          alert("로그인에 성공했습니다");
          setLocalStorage("token", res.data.token);
          navigate("/game");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (isAxiosError(err)) {
          console.log(err.response);
          alert("아이디 또는 비밀번호가 잘못되었습니다");
        }
      });
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
      <Loading isLoading={isLoading} />
      <div className="bg-sky-50 text-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
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
            value={inputs.id}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.pw}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, pw: e.target.value }))
            }
          />
          <input
            type="submit"
            value="로그인"
            onClick={onSubmit}
            className="w-full font-semibold bg-blue-500 text-sky-100 p-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
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
