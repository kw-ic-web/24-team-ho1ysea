import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { validateTokenApi } from "@apis/userRestful";
import LandingButton from "@components/landing/LandingButton";
import LoginModal from "@components/landing/LoginModal";
import RegisterModal from "@components/landing/RegisterModal";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";

export default function LandingPage() {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const [openModal, setOpenModal] = useState<string>("");

  const handleLoginBtn = () => {
    setOpenModal("login");
  };

  const handleRegisterBtn = () => {
    setOpenModal("register");
  };

  const handleGoPrevBtn = () => {
    setOpenModal("");
  };

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
      <div className="absolute right-20 bottom-20">
        <LandingButton onClick={handleLoginBtn}>로그인</LandingButton>
        <LandingButton onClick={handleRegisterBtn}>회원가입</LandingButton>
      </div>
      {openModal === "login" && (
        <LoginModal
          onPrevClick={handleGoPrevBtn}
          onRegisterClick={handleRegisterBtn}
        />
      )}
      {openModal === "register" && (
        <RegisterModal
          onPrevClick={handleGoPrevBtn}
          onLoginClick={handleLoginBtn}
        />
      )}
    </div>
  );
}
