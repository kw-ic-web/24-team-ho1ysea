import ViewUsers from "@components/admin/ViewUsers";
import { useValidateAdmin } from "@hooks/admin/useValidateAdmin";

export default function AdminPage() {
  // 사용자가 어드민인지 확인하고 처리 수행
  useValidateAdmin();

  return (
    <div className="bg-sky-100 text-gray-800">
      <p>어드민 페이지 임니다</p>
      <ViewUsers />
    </div>
  );
}
