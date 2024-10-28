import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GamePage from "@pages/GamePage";
import LandingPage from "@pages/LandingPage";
import AdminPage from "@pages/AdminPage";
import ViewUsers from "@components/admin/ViewUsers";
import EditSetting from "@components/admin/EditSetting";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="view-users" element={<ViewUsers />} />
          <Route path="edit-setting" element={<EditSetting />} />
          <Route index element={<Navigate to="view-users" replace />} />
          {/* <Route index />는 부모 경로에 대한 기본 경로를 처리 */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
