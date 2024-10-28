import Loading from "@components/common/Loading";
import { useUsersData } from "@hooks/admin/useUsersData";

export default function ViewUsers() {
  const { usersData, isLoading } = useUsersData();

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
              </tr>
            </thead>
            <tbody>
              {usersData.map((userData, index) => (
                <tr key={index} className="hover:bg-sky-100">
                  <td className="px-6 py-4 border-b">{userData.userId}</td>
                  <td className="px-6 py-4 border-b">{userData.nickName}</td>
                  <td className="px-6 py-4 border-b">{userData.countPlay}</td>
                  <td className="px-6 py-4 border-b">{userData.reportCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
