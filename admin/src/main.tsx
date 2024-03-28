import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import LandingPage from "./customComponents/LandingPage";
import Verification from "./customComponents/authentication/verification";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={"/"}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<App />} />
        <Route path="/app/verify-email" element={<Verification />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
