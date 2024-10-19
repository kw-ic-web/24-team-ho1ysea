import { BuyItem } from "@@types/itemsType";
import { StoreItems } from "@@types/StoreType";
import axios from "axios";

/**
 * @description 모든 상점 아이템 조회
 */
export const allStoreItemsApi = () => {
  return axios.get<StoreItems>(`${import.meta.env.VITE_API_URL}/store/items`);
};

/**
 * @description 상점에서 특정 아이템 구매
 * @param itemId 구매할 아이템
 * @param quantity 구매할 수량
 * @param token JWT토큰
 */
export const buyStoreItemApi = (
  itemId: string,
  quantity: number,
  token: string
) => {
  return axios.post<BuyItem>(
    `${import.meta.env.VITE_API_URL}/store/buy`,
    {
      itemId,
      quantity,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
