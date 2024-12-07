import { User } from "@@types/adminType";
import Loading from "@components/common/Loading";
import BanModal from "@components/admin/BanModal";
import { useUsersData } from "@hooks/admin/useUsersData";
import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function ViewUsers() {
  const { userLists, isLoading, refreshBannedUsers } = useUsersData();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="flex flex-col items-center p-6 text-gray-800">
      <Loading isLoading={isLoading} />
      <h1 className="text-2xl font-bold mb-6">전체 유저 정보</h1>
      <div className="w-full max-w-2xl">
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          {userLists.allUsers.length > 0 ? (
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
                    Report Count
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold border-b">
                    Ban
                  </th>
                </tr>
              </thead>
              <tbody>
                {userLists.allUsers.map((userData, index) => (
                  <tr key={index} className="hover:bg-sky-100">
                    <td className="px-6 py-4 border-b">{userData.userId}</td>
                    <td className="px-6 py-4 border-b">{userData.nickName}</td>
                    <td className="px-6 py-4 border-b">
                      {userData.reportCount}
                    </td>
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
          ) : (
            <p className="text-center font-semibold text-lg m-4 p-4">
              현재 가입된 유저가 없습니다.
            </p>
          )}
        </div>
      </div>

      <h1 className="mt-16 text-2xl font-bold mb-6">제재된 유저 정보</h1>
      <div className="w-full max-w-2xl">
        <div className="overflow-x-auto rounded-xl border border-gray-300">
          {userLists.bannedUsers.length > 0 ? (
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
                    Freedom At
                  </th>
                </tr>
              </thead>
              <tbody>
                {userLists.bannedUsers.map((userData, index) => (
                  <tr key={index} className="hover:bg-sky-100">
                    <td className="px-6 py-4 border-b">{userData.userId}</td>
                    <td className="px-6 py-4 border-b">{userData.nickName}</td>
                    <td className="px-6 py-4 border-b">
                      {format(userData.freedomAt, "yy-MM-dd (E) hh:mm:ss", {
                        locale: ko,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center font-semibold text-lg m-4 p-4">
              제재된 유저가 없습니다.
            </p>
          )}
        </div>
      </div>

      {selectedUser && (
        <BanModal
          selectedUser={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            refreshBannedUsers();
          }}
        />
      )}
    </div>
  );
}
