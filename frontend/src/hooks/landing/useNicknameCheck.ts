import { nickNameCheckApi } from "@apis/userRestful";
import { isAxiosError } from "axios";
import { useState } from "react";

export const useNicknameCheck = (nickName: string) => {
  const [isNickNameCheck, setIsNickNameCheck] = useState<boolean>(false);
  const [nickNameMsg, setNickNameMsg] = useState<string>("");

  const handleNickNameCheckClick = () => {
    if (!nickName) {
      setNickNameMsg("닉네임을 입력해주세요");
      setIsNickNameCheck(false);
      return;
    }

    nickNameCheckApi(nickName)
      .then((res) => {
        const { isAvailable } = res.data;
        if (isAvailable) {
          setNickNameMsg("사용 가능한 닉네임입니다");
          setIsNickNameCheck(true);
        } else {
          setNickNameMsg("사용 불가능한 닉네임입니다");
          setIsNickNameCheck(false);
        }
      })
      .catch((err) => {
        if (isAxiosError(err)) {
          console.log("서버 오류");
          console.log(err.response);
          setIsNickNameCheck(false);
          setNickNameMsg("잠시 후 다시 시도해주세요");
        }
      });
  };

  return { isNickNameCheck, nickNameMsg, handleNickNameCheckClick };
};
