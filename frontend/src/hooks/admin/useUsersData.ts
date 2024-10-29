import { User } from "@@types/adminType";
import { getAllUsersApi, getReportsApi } from "@apis/adminRestful";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

export const useUsersData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usersData, setUsersData] = useState<Required<User>[]>([]);

  useEffect(() => {
    const fetch = async (token: string) => {
      try {
        setIsLoading(true);
        const [usersRes, reportsRes] = await Promise.all([
          getAllUsersApi(token).then((res) => res.data),
          getReportsApi(token).then((res) => res.data),
          new Promise((resolve) => setTimeout(resolve, 200)), // 최소 로딩 대기시간
        ]);
        setUsersData(() =>
          // 조인해서 usersData state에 추가
          usersRes.map((user) => {
            const report = reportsRes.find(
              (report) => report.userId === user.userId
            );
            return { ...user, reportCount: report ? report.reportCount : 0 };
          })
        );
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
