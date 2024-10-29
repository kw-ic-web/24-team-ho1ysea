import { User } from "@@types/adminType";
import { getAllUsersApi } from "@apis/adminRestful";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

export const useUsersData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersData, setUsersData] = useState<User[]>([]);

  useEffect(() => {
    const fetch = async (token: string) => {
      try {
        setIsLoading(true);
        const [usersRes] = await Promise.all([
          getAllUsersApi(token).then((res) => res.data),
          new Promise((resolve) => setTimeout(resolve, 200)), // 최소 로딩 대기시간
        ]);
        setUsersData(usersRes);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    const token = getLocalStorage("token");
    if (token) {
      fetch(token);
    }
  }, []);

  return { usersData, isLoading };
};
