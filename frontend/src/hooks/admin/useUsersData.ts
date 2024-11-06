import { BannedUser, User } from "@@types/adminType";
import { getAllUsersApi, getBanUsersApi } from "@apis/adminRestful";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

export const useUsersData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLists, setUserLists] = useState<{
    allUsers: User[];
    bannedUsers: BannedUser[];
  }>({ allUsers: [], bannedUsers: [] });

  const refreshBannedUsers = async () => {
    const token = getLocalStorage("token");
    if (!token) return;

    try {
      setIsLoading(true);
      const bannedUsersRes = await getBanUsersApi(token).then(
        (res) => res.data
      );
      setUserLists((prev) => ({ ...prev, bannedUsers: bannedUsersRes }));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async (token: string) => {
      try {
        setIsLoading(true);
        const [usersRes, bannedUsersRes] = await Promise.all([
          getAllUsersApi(token).then((res) => res.data),
          getBanUsersApi(token).then((res) => res.data),
          new Promise((resolve) => setTimeout(resolve, 200)), // 최소 로딩 대기시간
        ]);
        setUserLists({ allUsers: usersRes, bannedUsers: bannedUsersRes });
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

  return { userLists, isLoading, refreshBannedUsers };
};
