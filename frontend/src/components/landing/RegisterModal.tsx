import { Inputs } from "@@types/registerTypes";
import { signUpApi } from "@apis/userRestful";
import Loading from "@components/common/Loading";
import { useInputCheck } from "@hooks/landing/useInputCheck";
import { isAxiosError } from "axios";
import { useState } from "react";
import { AiFillCloseSquare } from "react-icons/ai";

interface Props {
  onPrevClick: () => void;
  onLoginClick: () => void;
}

export default function RegisterModal({ onPrevClick, onLoginClick }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 입력 field state
  const [inputs, setInputs] = useState<Inputs>({
    nickName: "",
    id: "",
    pw: "",
    checkPw: "",
  });

  const { isChecks, infoMsgs, handleInputCheck } = useInputCheck(
    inputs,
    setIsLoading
  );

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 이벤트 버블링으로 인해, target과 currentTarget을 비교하지 않으면
    // 모달 내 어떤 요소를 눌러도 모달창이 닫힌다.
    if (e.target === e.currentTarget) {
      onPrevClick();
    }
  };

  // 회원가입 버튼 클릭 리스너
  const onSubmit = () => {
    setIsLoading(true);
    signUpApi(inputs.id, inputs.pw, inputs.nickName)
      .then((res) => {
        setIsLoading(false);
        console.log(res);
        alert("회원가입 되었습니다. 로그인 해주세요");
        onLoginClick();
      })
      .catch((err) => {
        setIsLoading(false);
        if (isAxiosError(err)) {
          if (err.status === 400) {
            console.log(err.response);
            alert(err.response?.data.message || "오류가 발생했습니다");
          } else {
            console.log(err.response);
            alert("잠시 후 다시 시도해주세요");
          }
        }
      });
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
        <div className="text-xl font-semibold text-center mb-6">회원가입</div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex relative">
            <input
              name="nickName"
              type="text"
              placeholder="Your nickname"
              className="w-full h-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.nickName}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
            <button
              className="absolute right-0 p-[10.5px] border-slate-700 bg-slate-700 text-slate-200 transition-colors rounded-r-lg hover:bg-slate-600"
              onClick={() => handleInputCheck("nickName")}
            >
              닉네임 확인
            </button>
          </div>
          <div className="flex justify-end items-center mb-4">
            <p
              className={`w-fit text-end text-sm ${
                isChecks.nickName ? "text-green-500" : "text-red-500"
              }`}
            >
              {infoMsgs.nickName}
            </p>
          </div>
          <div className="flex relative">
            <input
              name="id"
              type="text"
              autoComplete="username"
              placeholder="ID"
              className="w-full h-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputs.id}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
            <button
              className="absolute right-0 p-[10.5px] border-slate-700 bg-slate-700 text-slate-200 transition-colors rounded-r-lg hover:bg-slate-600"
              onClick={() => handleInputCheck("id")}
            >
              ID 확인
            </button>
          </div>
          <div className="flex justify-end items-center mb-4">
            <p
              className={`w-fit text-end text-sm ${
                isChecks.id ? "text-green-500" : "text-red-500"
              }`}
            >
              {infoMsgs.id}
            </p>
          </div>
          <input
            name="pw"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.pw}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          />
          <input
            name="checkPw"
            type="password"
            autoComplete="new-password"
            placeholder="Check again password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputs.checkPw}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          />
          <div className="flex justify-end items-center mb-4">
            <p
              className={`w-fit text-end text-sm ${
                isChecks.pw ? "text-green-500" : "text-red-500"
              }`}
            >
              {infoMsgs.pw}
            </p>
          </div>
          <input
            type="submit"
            value="회원가입"
            onClick={onSubmit}
            disabled={!isChecks.id || !isChecks.nickName || !isChecks.pw}
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
