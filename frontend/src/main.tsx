import { createRoot } from "react-dom/client";
import "./index.css";
import ToastModal from "@components/common/ToastModal";
import Router from "@router/Router";

createRoot(document.getElementById("root")!).render(
  <>
    <Router />
    <ToastModal />
  </>
);
