import AdminHeader from "@components/admin/AdminHeader";
import Loading from "@components/common/Loading";
import { useValidateAdmin } from "@hooks/admin/useValidateAdmin";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
  // 사용자가 어드민인지 확인하고 처리 수행
  const isLoading = useValidateAdmin();

  // 관리자 권한이 확인되기 전까지 페이지 내용 렌더링을 지연
  if (isLoading) {
    return <Loading isLoading={true} />;
  }

  // 권한 검증 완료 후에만 관리자 페이지를 렌더링
  return (
    <div className="text-gray-800 bg-sky-50 min-h-screen">
      <AdminHeader />
      <Outlet />
    </div>
  );
}
