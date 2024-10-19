import axios from "axios";

/**
 * @description 토큰 유효성 검증 API
 * @param token JWT토큰
 */
export const validateTokenApi = (token: string) => {
  return axios.get<{ message: string }>(
    `${import.meta.env.VITE_API_URL}/user/validate`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

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
    `${import.meta.env.VITE_API_URL}/user/check-nickname?nickName=${nickName}`
  );
};

/**
 * @description 회원가입 API
 */
export const signUpApi = (id: string, password: string, nickName: string) => {
  return axios.post<{ message: string; userId: string }>(
    `${import.meta.env.VITE_API_URL}/user/signup`,
    {
      id,
      password,
      nickName,
    }
  );
};

/**
 * @description 로그인 API
 */
export const loginApi = (id: string, password: string) => {
  return axios.post<{ token: string; userId: string }>(
    `${import.meta.env.VITE_API_URL}/user/login`,
    {
      id,
      password,
    }
  );
};
