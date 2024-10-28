import { BrowserRouter, Route, Routes } from "react-router-dom";
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
