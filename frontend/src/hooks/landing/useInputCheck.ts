import { InfoMsgs, Inputs, IsChecks } from "@@types/registerTypes";
import { idCheckApi, nickNameCheckApi } from "@apis/userRestful";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

export const useInputCheck = (
  inputs: Inputs,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [isChecks, setIsChecks] = useState<IsChecks>({
    nickName: false,
    id: false,
    pw: false,
  });

  const [infoMsgs, setInfoMsgs] = useState<InfoMsgs>({
    nickName: "",
    id: "",
    pw: "",
  });

  /**
   * @description 상태 업데이트를 도와주는 헬퍼 함수
   */
  const updateState = (key: keyof IsChecks, msg: string, isCheck: boolean) => {
    setInfoMsgs((prev) => ({ ...prev, [key]: msg }));
    setIsChecks((prev) => ({ ...prev, [key]: isCheck }));
  };

  const nickNameCheck = () => {
    if (!inputs.nickName) {
      updateState("nickName", "닉네임을 입력해주세요", false);
      return;
    }
    setIsLoading(true);
    nickNameCheckApi(inputs.nickName)
      .then((res) => {
        setIsLoading(false);
        const { isAvailable } = res.data;
        const msg = isAvailable
          ? "사용 가능한 닉네임입니다"
          : "사용 불가능한 닉네임입니다";
        updateState("nickName", msg, isAvailable);
      })
      .catch((err) => {
        setIsLoading(false);
        if (isAxiosError(err)) {
          console.log("서버 오류");
          console.log(err.response);
          updateState("nickName", "잠시 후 다시 시도해주세요", false);
        }
      });
  };

  const idCheck = () => {
    if (!inputs.id) {
      updateState("id", "아이디를 입력해주세요", false);
      return;
    }
    setIsLoading(true);
    idCheckApi(inputs.id)
      .then((res) => {
        setIsLoading(false);
        const { isAvailable } = res.data;
        const msg = isAvailable
          ? "사용 가능한 아이디입니다"
          : "사용 불가능한 아이디입니다";
        updateState("id", msg, isAvailable);
      })
      .catch((err) => {
        setIsLoading(false);
        if (isAxiosError(err)) {
          console.log("서버 오류");
          console.log(err.response);
          updateState("id", "잠시 후 다시 시도해주세요", false);
        }
      });
  };

  /**
   * @description id 중복 체크 / nickName 중복 체크를 실행하는 함수
   */
  const handleInputCheck = (name: string) => {
    if (name === "id") {
      idCheck();
    } else if (name === "nickName") {
      nickNameCheck();
    }
  };

  // 비밀번호 일치 유무 체크
  useEffect(() => {
    if (inputs.pw && inputs.checkPw) {
      if (inputs.pw === inputs.checkPw) {
        updateState("pw", "비밀번호가 확인되었습니다", true);
      } else {
        updateState("pw", "비밀번호가 다릅니다", false);
      }
    }
  }, [inputs.pw, inputs.checkPw]);

  return { isChecks, infoMsgs, handleInputCheck };
};
