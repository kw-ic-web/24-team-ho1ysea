import axios from "axios";

/**
 * @description ID 중복 여부 검사하는 API
 */
export const idCheckApi = (id: string) => {
  return axios.get<{ isAvailable: boolean }>(
    `${import.meta.env.VITE_API_URL}/user/check-id?id=${id}`
  );
};

/**
 * @description 닉네임 중복 여부 검사하는 API
 */
export const nickNameCheckApi = (nickName: string) => {
  return axios.get<{ isAvailable: boolean }>(
    `${import.meta.env.VITE_API_URL}/user/check-nickname?nickname=${nickName}`
  );
};

/**
 * @description 회원가입 API
 */
export const signUpApi = (
  userName: string,
  id: string,
  password: string,
  nickName: string
) => {
  return axios.post<{ message: string }>(
    `${import.meta.env.VITE_API_URL}/user/signup`,
    {
      userName,
      id,
      password,
      nickName,
    }
  );
};
