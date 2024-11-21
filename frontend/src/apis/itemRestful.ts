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
