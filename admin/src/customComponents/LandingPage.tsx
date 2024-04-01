import { useBuildModeController } from "@firecms/core";
import React from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const modeController = useBuildModeController();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Welcome to the landing page</h1>
      <p>
        This is a custom landing page. You can use it to display information
        about your project or to implement a custom login view.
      </p>
      <p>
        The current mode is <strong>{modeController.mode}</strong>
      </p>
      <button className="btn" onClick={() => navigate("/app")}>
        Go to the admin panel
      </button>
    </div>
  );
}
