import { User } from "@@types/adminType";
import Loading from "@components/common/Loading";
import BanModal from "@components/admin/BanModal";
import { useUsersData } from "@hooks/admin/useUsersData";
import { useState } from "react";

export default function ViewUsers() {
  const { usersData, isLoading } = useUsersData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex flex-col items-center p-6 text-gray-800">
      <Loading isLoading={isLoading} />
      <h1 className="text-2xl font-bold mb-6">전체 유저 정보</h1>
      <div className="w-full max-w-2xl">
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          <table className="min-w-full bg-sky-50 shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                  Nickname
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                  Play Count
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold border-b">
                  Report Count
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold border-b">
                  Ban
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((userData, index) => (
                <tr key={index} className="hover:bg-sky-100">
                  <td className="px-6 py-4 border-b">{userData.userId}</td>
                  <td className="px-6 py-4 border-b">{userData.nickName}</td>
                  <td className="px-6 py-4 border-b">{userData.countPlay}</td>
                  <td className="px-6 py-4 border-b">{userData.reportCount}</td>
                  <td className="px-6 py-4 border-b flex justify-center items-center">
                    <button
                      onClick={() => setSelectedUser(userData)}
                      className="bg-red-500 text-sm text-slate-200 px-4 py-2 rounded-lg hover:bg-red-400 transition-all"
                    >
                      제재하기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <BanModal
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
