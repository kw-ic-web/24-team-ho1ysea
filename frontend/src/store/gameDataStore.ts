import { Currency } from "@@types/currencyType";
import { MyItems } from "@@types/itemsType";
import { StoreItems } from "@@types/StoreType";
import { myCoinApi } from "@apis/currencyRestful";
import { myItemsApi } from "@apis/itemRestful";
import { allStoreItemsApi } from "@apis/storeRestful";
import { userInfoApi } from "@apis/userRestful";
import { create } from "zustand";

interface GameDataStore {
  nickName: string;
  userId: string;
  myItems: MyItems;
  myCurrency: Currency;
  storeItems: StoreItems;
  isLoading: boolean;

  initialize: (token: string) => Promise<void>;
  fetchMyItems: (token: string) => Promise<void>;
  setMyTrashAmount: (newTrashAmount: number) => void; // 보유 쓰레기량 업데이트하는 setter 함수
  fetchMyCurrency: (token: string) => Promise<void>;
  fetchStoreItems: () => Promise<void>;
}

/**
 * @description 사용자가 보유한 아이템 / 재화 데이터를 관리하는 zustand 스토어
 */
export const useGameDataStore = create<GameDataStore>((set) => ({
  nickName: "",
  userId: "",
  myItems: [],
  myCurrency: { coin: 0, trash: 0 },
  storeItems: [],
  isLoading: false,

  initialize: async (token: string) => {
    set((prev) => ({ ...prev, isLoading: true }));
    try {
      const [userInfoRes, itemsRes, coinRes, storeItemsRes] = await Promise.all(
        [
          userInfoApi(token).then((res) => res.data),
          myItemsApi(token).then((res) => res.data),
          myCoinApi(token).then((res) => res.data.coin),
          allStoreItemsApi().then((res) => res.data),
        ]
      );
      set((prev) => ({
        ...prev,
        nickName: userInfoRes.nickName,
        userId: userInfoRes.id,
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
  setMyTrashAmount: (newTrashAmount) => {
    set((prev) => ({
      ...prev,
      myCurrency: { ...prev.myCurrency, trash: newTrashAmount },
    }));
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
