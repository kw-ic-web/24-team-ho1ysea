import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { validateTokenApi } from "@apis/userRestful";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  // JWT 토큰이 존재하고 유효한 경우 GamePage로 리다이렉트
  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getLocalStorage("token");
        if (token) {
          const message = await validateTokenApi(token).then(
            (res) => res.data.message
          );
          console.log(message);
          showToast("자동 로그인 성공");
          navigate("/game");
        }
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err.response);
        }
      }
    };
    validateToken();
  }, [navigate, showToast]);

  return (
    <div className="w-screen h-screen relative flex justify-center items-center bg-sky-100 text-gray-800">
      <div className="absolute top-20 left-20">
        <p className="text-3xl font-bold">바다 이야기</p>
      </div>
      <div className="absolute flex flex-col text-center right-20 bottom-20">
        <Link
          to="login"
          className="bg-blue-500 hover:bg-blue-600 min-w-28 px-3 py-2 m-2 border rounded-xl text-slate-200"
        >
          로그인
        </Link>
        <Link
          to="register"
          className="bg-blue-500 hover:bg-blue-600 min-w-28 px-3 py-2 m-2 border rounded-xl text-slate-200"
        >
          회원가입
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
