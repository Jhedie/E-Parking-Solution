import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import LandingPage from "./customComponents/LandingPage";
import "./index.css";
import { ConfigProvider } from "./providers/Config/ConfigProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <ConfigProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
