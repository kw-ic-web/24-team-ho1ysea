import LandingButton from "@components/landing/LandingButton";
import LoginModal from "@components/landing/LoginModal";
import RegisterModal from "@components/landing/RegisterModal";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [openModal, setOpenModal] = useState<string>("");
  useEffect(() => {
    console.log("openModal: ", openModal);
  }, [openModal]);

  const handleLoginBtn = () => {
    setOpenModal("login");
  };

  const handleRegisterBtn = () => {
    setOpenModal("register");
  };

  const handleGoPrevBtn = () => {
    setOpenModal("");
  };

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
