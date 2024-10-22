import { Users } from "@@types/adminType";
import { getAllUsersApi } from "@apis/adminRestful";
import { getLocalStorage } from "@utils/localStorage";
import { useEffect, useState } from "react";

export default function ViewUsers() {
  const [usersData, setUsersData] = useState<Users>([]);

  useEffect(() => {
    const fetchUsersData = async (token: string) => {
      const usersDataRes = await getAllUsersApi(token).then((res) => res.data);
      setUsersData(usersDataRes);
    };

    const token = getLocalStorage("token");
    if (token) {
      fetchUsersData(token);
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">전체 유저 정보</h1>
      <div className="w-full max-w-2xl">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                  Nickname
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 border-b">
                  Play Count
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((userData, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">{userData.userId}</td>
                  <td className="px-6 py-4 border-b">{userData.nickName}</td>
                  <td className="px-6 py-4 border-b">{userData.countPlay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
