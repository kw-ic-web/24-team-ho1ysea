import { idCheckApi } from "@apis/userRestful";
import { isAxiosError } from "axios";
import { useState } from "react";

export const useIdCheck = (id: string) => {
  const [isIdCheck, setIsIdCheck] = useState<boolean>(false);
  const [idMsg, setIdMsg] = useState<string>("");

  const handleIdCheckClick = () => {
    idCheckApi(id)
      .then((res) => {
        const { isAvailable } = res.data;
        if (isAvailable) {
          setIdMsg("사용 가능한 아이디입니다");
          setIsIdCheck(true);
        } else {
          setIdMsg("사용 불가능한 아이디입니다");
          setIsIdCheck(false);
        }
      })
      .catch((err) => {
        if (isAxiosError(err)) {
          console.log("서버 오류");
          console.log(err.response);
          setIsIdCheck(false);
          setIdMsg("잠시 후 다시 시도해주세요");
        }
      });
  };

  return { isIdCheck, idMsg, handleIdCheckClick };
};
