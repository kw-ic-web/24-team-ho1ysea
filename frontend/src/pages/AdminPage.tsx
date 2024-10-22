import { useValidateAdmin } from "@hooks/admin/useValidateAdmin";

export default function AdminPage() {
  // 사용자가 어드민인지 확인하고 처리 수행
  useValidateAdmin();

  return (
    <div>
      <p>어드민 페이지 임니다</p>
    </div>
  );
}
