import { MyItems, UseItem } from "@@types/itemsType";
import axios from "axios";

/**
 * @description 유저가 보유한 아이템 조회
 */
export const myItemsApi = (token: string) => {
  return axios.get<MyItems>(`${import.meta.env.VITE_API_URL}/item/inventorys`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description 아이템 사용하면 호출하는 API
 * @param token JWT 토큰
 * @param itemId 사용한 아이템 itemId
 */
export const utilizeItemApi = (token: string, itemId: string) => {
  return axios.post<UseItem>(
    `${import.meta.env.VITE_API_URL}/item/use`,
    {
      itemId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

/**
 * @description 필드에서 아이템을 주워서 서버에서 주운 아이템 정보를 받으면 호출하는 API
 * @param token JWT 토큰
 * @param itemId 습득한 아이템 itemId
 */
export const getItemApi = (token: string, itemId: string) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/item/get`,
    {
      itemId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
