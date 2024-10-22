import { BrowserRouter, Route, Routes } from "react-router-dom";
import GamePage from "@pages/GamePage";
import LandingPage from "@pages/LandingPage";
import AdminPage from "@pages/AdminPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
