import { Currency } from "@@types/currencyType";
import { MyItems } from "@@types/itemsType";
import { StoreItems } from "@@types/StoreType";
import { myCoinApi } from "@apis/currencyRestful";
import { myItemsApi } from "@apis/itemRestful";
import { allStoreItemsApi } from "@apis/storeRestful";
import { create } from "zustand";

interface GameDataStore {
  myItems: MyItems;
  myCurrency: Currency;
  storeItems: StoreItems;
  isLoading: boolean;

  initialize: (token: string) => Promise<void>;
  fetchMyItems: (token: string) => Promise<void>;
  fetchMyCurrency: (token: string) => Promise<void>;
  fetchStoreItems: () => Promise<void>;
}

/**
 * @description 사용자가 보유한 아이템 / 재화 데이터를 관리하는 zustand 스토어
 */
export const useGameDataStore = create<GameDataStore>((set) => ({
  myItems: [],
  myCurrency: { coin: 0, trash: 0 },
  storeItems: [],
  isLoading: false,

  initialize: async (token: string) => {
    set((prev) => ({ ...prev, isLoading: true }));
    try {
      const [itemsRes, coinRes, storeItemsRes] = await Promise.all([
        myItemsApi(token).then((res) => res.data),
        myCoinApi(token).then((res) => res.data.coin),
        allStoreItemsApi().then((res) => res.data),
      ]);
      set((prev) => ({
        ...prev,
        myItems: itemsRes,
        myCurrency: { coin: coinRes, trash: prev.myCurrency.trash },
        storeItems: storeItemsRes,
        isLoading: false,
      }));
    } catch (err) {
      console.error("initialize fetch 실패:", err);
      set((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  },
  fetchMyItems: async (token: string) => {
    set((prev) => ({ ...prev, isLoading: true }));
    try {
      const itemsRes = await myItemsApi(token).then((res) => res.data);
      set((prev) => ({ ...prev, myItems: itemsRes, isLoading: false }));
    } catch (err) {
      console.error("myItems fetch 실패:", err);
      set((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  },
  fetchMyCurrency: async (token: string) => {
    set((prev) => ({ ...prev, isLoading: true }));
    try {
      const coinRes = await myCoinApi(token).then((res) => res.data.coin);
      set((prev) => ({
        ...prev,
        myCurrency: { coin: coinRes, trash: prev.myCurrency.trash },
        isLoading: false,
      }));
    } catch (err) {
      console.error("myCurrency fetch 실패:", err);
      set((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  },
  fetchStoreItems: async () => {
    set((prev) => ({ ...prev, isLoading: true }));
    try {
      const storeItemsRes = await allStoreItemsApi().then((res) => res.data);
      set((prev) => ({
        ...prev,
        storeItems: storeItemsRes,
        isLoading: false,
      }));
    } catch (err) {
      console.error("storeItems fetch 실패:", err);
      set((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  },
}));