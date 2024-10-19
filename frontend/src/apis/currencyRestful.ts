import { TrashExchange } from "@@types/currencyType";
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

/**
 * @description 유저가 수집한 쓰레기 환전
 * @param trashAmount 환전할 쓰레기 양
 * @param token JWT토큰
 */
export const trashExchangeApi = (trashAmount: number, token: string) => {
  return axios.post<TrashExchange>(
    `${import.meta.env.VITE_API_URL}/store/exchange`,
    { trashAmount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
