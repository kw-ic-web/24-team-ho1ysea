import { MyItems } from "@@types/itemsType";
import { StoreItems } from "@@types/StoreType";
import { trashExchangeApi } from "@apis/currencyRestful";
import { buyStoreItemApi, sellStoreItemApi } from "@apis/storeRestful";
import { useGameDataStore } from "@store/gameDataStore";
import { useToastStore } from "@store/toastStore";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description 상점 아이템, 내 보유 아이템, 아이템 구매, 아이템 판매 등을 위한 함수 / state를 반환하는 커스텀 훅
 */
export const useItemStore = (isOpen: boolean) => {
  const navigate = useNavigate();
  const { showToast } = useToastStore();
  const { myItems, myCurrency, storeItems, fetchMyItems, fetchMyCurrency } =
    useGameDataStore();

  /**
   * @description 아이템 구매 핸들 함수
   */
  const handleBuyItem = useCallback(
    async (item: StoreItems[0]) => {
      try {
        const { itemId, itemName } = item;
        const token = getLocalStorage("token");
        if (!token) {
          showToast("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }

        await buyStoreItemApi(itemId, 1, token);
        showToast(itemName + " 구매 성공!");

        fetchMyItems(token);
        fetchMyCurrency(token);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            showToast("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          } else if (err.status === 400) {
            showToast(err.response?.data.message);
          } else {
            showToast(
              "아이템 구매에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
          }
        }
      }
    },
    [fetchMyCurrency, fetchMyItems, navigate, showToast]
  );

  /**
   * @description 아이템 판매 핸들 함수
   */
  const handleSellItem = useCallback(
    async (item: MyItems[0]) => {
      try {
        const { itemId, itemName } = item;
        const token = getLocalStorage("token");
        if (!token) {
          showToast("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }

        await sellStoreItemApi(itemId, 1, token);
        showToast(itemName + " 판매 성공!");

        fetchMyItems(token);
        fetchMyCurrency(token);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            showToast("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          } else if (err.status === 400) {
            showToast(err.response?.data.message);
          } else {
            showToast(
              "아이템 판매에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
          }
        }
      }
    },
    [fetchMyCurrency, fetchMyItems, navigate, showToast]
  );

  /**
   * @description 보유 쓰레기 환전 핸들 함수
   */
  const handleTrashExchange = useCallback(async () => {
    try {
      const token = getLocalStorage("token");
      if (!token) {
        showToast("먼저 로그인 해주세요.");
        navigate("/");
        return;
      }

      const exchangedGold = await trashExchangeApi(
        myCurrency.trash,
        token
      ).then((res) => res.data.exchangedGold);
      showToast(exchangedGold + " 원 환전 성공!");
      fetchMyCurrency(token);
    } catch (err) {
      if (isAxiosError(err)) {
        console.error(err);
        if (err.status === 401) {
          showToast("세션이 만료되었습니다. 다시 로그인 해주세요.");
          navigate("/");
        } else if (err.status === 400) {
          showToast(err.response?.data.message);
        }
      }
    }
  }, [myCurrency.trash, navigate, showToast, fetchMyCurrency]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getLocalStorage("token");
        if (!token) {
          showToast("먼저 로그인 해주세요.");
          navigate("/");
          return;
        }
        fetchMyItems(token);
        fetchMyCurrency(token);
      } catch (err) {
        if (isAxiosError(err)) {
          console.error(err);
          if (err.status === 401) {
            showToast("세션이 만료되었습니다. 다시 로그인 해주세요.");
            navigate("/");
          }
        }
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [fetchMyCurrency, fetchMyItems, isOpen, navigate, showToast]);

  return {
    storeItems,
    myItems,
    myCurrency,
    handleBuyItem,
    handleSellItem,
    handleTrashExchange,
  };
};
