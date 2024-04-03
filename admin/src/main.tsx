import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import LandingPage from "./customComponents/LandingPage";
import Verification from "./customComponents/authentication/verification";
import "./index.css";
import { ConfigProvider } from "./providers/Config/ConfigProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <Toaster position="top-center" />
      <ConfigProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/verify-email" element={<Verification />} />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
