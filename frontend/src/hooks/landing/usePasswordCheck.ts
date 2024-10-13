import { useEffect, useState } from "react";

export const usePasswordCheck = (pw: string, checkPw: string) => {
  const [isPwCheck, setIsPwCheck] = useState<boolean>(false);
  const [pwMsg, setPwMsg] = useState<string>("");

  useEffect(() => {
    if (pw && checkPw) {
      if (pw === checkPw) {
        setIsPwCheck(true);
        setPwMsg("비밀번호가 확인되었습니다");
      } else {
        setIsPwCheck(false);
        setPwMsg("비밀번호가 다릅니다");
      }
    }
  }, [pw, checkPw]);

  return { isPwCheck, pwMsg };
};
