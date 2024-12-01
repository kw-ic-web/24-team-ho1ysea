import { validateTokenApi } from "@apis/userRestful";
import { useGameDataStore } from "@store/gameDataStore";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckLogin = () => {
  const showToast = useToastStore((s) => s.showToast);
  const initialize = useGameDataStore((s) => s.initialize);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = getLocalStorage("token");
        if (!token) {
          showToast("토큰이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/");
          return;
        }
        await validateTokenApi(token).then((res) => res.data.message);
        await initialize(token);
      } catch (e) {
        showToast("인증 실패, 다시 로그인해주세요.");
        navigate("/");
        if (isAxiosError(e)) console.error(e.response);
        return;
      }
    };

    validateToken();
  }, [initialize, navigate, showToast]);
};
