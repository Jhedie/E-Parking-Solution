import { useBuildModeController } from "@firecms/core";
import React from "react";

export default function LandingPage() {
  const modeController = useBuildModeController();

  return (
    <div>
      <h1>Welcome to the landing page</h1>
      <p>
        This is a custom landing page. You can use it to display information
        about your project or to implement a custom login view.
      </p>
      <p>
        The current mode is <strong>{modeController.mode}</strong>
      </p>
    </div>
  );
}
