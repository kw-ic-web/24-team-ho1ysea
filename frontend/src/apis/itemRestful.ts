import { MyItems, StoreItems } from "@@types/itemsType";
import axios from "axios";

/**
 * @description 모든 상점 아이템 조회
 */
export const allStoreItemsApi = () => {
  return axios.get<StoreItems>(`${import.meta.env.VITE_API_URL}/store/items`);
};

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
