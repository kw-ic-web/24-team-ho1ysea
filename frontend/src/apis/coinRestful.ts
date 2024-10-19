import axios from "axios";

/**
 * @description 유저가 보유한 재화 조회
 */
export const myCoinApi = (token: string) => {
  return axios.get<{ coin: number }>(
    `${import.meta.env.VITE_API_URL}/coin/my`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
