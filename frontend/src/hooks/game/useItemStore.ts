import { Currency } from "@@types/currencyType";
import { MyItems } from "@@types/itemsType";
import { StoreItems } from "@@types/StoreType";
import { myCoinApi } from "@apis/coinRestful";
import { myItemsApi } from "@apis/itemRestful";
import {
  allStoreItemsApi,
  buyStoreItemApi,
  sellStoreItemApi,
} from "@apis/storeRestful";
import { getLocalStorage } from "@utils/localStorage";
import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description 상점 아이템, 내 보유 아이템, 아이템 구매, 아이템 판매 등을 위한 함수 / state를 반환하는 커스텀 훅
 */
export const useItemStore = (isOpen: boolean) => {
  const navigate = useNavigate();
  const [storeItems, setStoreItems] = useState<StoreItems>([]);
  const [myItems, setMyItems] = useState<MyItems>([]);
  const [currency, setCurrency] = useState<Currency>({
    coin: 0,
    trash: 0,
  });

  const handleBuyItem = useCallback(
    async (item: StoreItems[0]) => {
      try {
        const { itemId, itemName } = item;
        const token = getLocalStorage("token");
        if (!token) {
          alert("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }

        await buyStoreItemApi(itemId, 1, token);
        alert(itemName + " 구매 성공!");

        const myItemsData = await myItemsApi(token).then((res) => res.data);
        const myCoinData = await myCoinApi(token!).then((res) => res.data.coin);
        setMyItems(myItemsData);
        setCurrency((prev) => ({ ...prev, coin: myCoinData }));
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          } else {
            alert(
              "아이템 구매에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
          }
        }
      }
    },
    [navigate]
  );

  const handleSellItem = useCallback(
    async (item: MyItems[0]) => {
      try {
        const { itemId, itemName } = item;
        const token = getLocalStorage("token");
        if (!token) {
          alert("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }

        await sellStoreItemApi(itemId, 1, token);
        alert(itemName + " 판매 성공!");

        const myItemsData = await myItemsApi(token).then((res) => res.data);
        const myCoinData = await myCoinApi(token!).then((res) => res.data.coin);
        setMyItems(myItemsData);
        setCurrency((prev) => ({ ...prev, coin: myCoinData }));
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          } else {
            alert(
              "아이템 판매에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
          }
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getLocalStorage("token");
        if (!token) {
          alert("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }

        const storeItemsData = await allStoreItemsApi().then((res) => res.data);
        const myItemsData = await myItemsApi(token).then((res) => res.data);
        const myCoinData = await myCoinApi(token).then((res) => res.data.coin);
        setStoreItems(storeItemsData);
        setMyItems(myItemsData);
        setCurrency((prev) => ({ ...prev, coin: myCoinData }));
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          }
        }
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, navigate]);

  // 추후 제거!!
  const handleIncCost = useCallback(async () => {
    try {
      console.log("클릭");
      const token = getLocalStorage("token");
      await axios.get(`${import.meta.env.VITE_API_URL}/coin/test`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const myCoinData = await myCoinApi(token!).then((res) => res.data.coin);
      setCurrency((prev) => ({ ...prev, coin: myCoinData }));
    } catch (err) {
      console.error("코인 갱신 중 오류:", err);
    }
  }, []);

  return {
    storeItems,
    myItems,
    currency,
    handleBuyItem,
    handleSellItem,
    handleIncCost,
  };
};
