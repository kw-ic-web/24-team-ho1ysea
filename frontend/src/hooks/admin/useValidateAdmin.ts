import { isAdminApi } from "@apis/adminRestful";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description 사용자가 admin인지 확인하고, admin이 아닌 경우 적절한 안내와 함께 다른 페이지로 던지는 커스텀 훅
 */
export const useValidateAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const validateAdmin = async (token: string) => {
      try {
        const message = await isAdminApi(token).then((res) => res.data.message);
        setIsLoading(false);
        showToast(message);
      } catch (err) {
        if (isAxiosError<{ message: string }>(err) && err.response) {
          showToast(err.response.data.message || "접근 권한이 없습니다.");

          if (err.response.status === 401) {
            navigate("/");
            return;
          } else if (err.response.status === 403) {
            navigate("/game");
            return;
          }
        } else {
          showToast("알 수 없는 에러가 발생했습니다.");
          navigate("/");
          return;
        }
      }
    };

    const token = getLocalStorage("token");
    if (token) {
      validateAdmin(token);
    } else {
      showToast("로그인이 필요합니다.");
      navigate("/");
    }
  }, [navigate, showToast]);

  return isLoading;
};
