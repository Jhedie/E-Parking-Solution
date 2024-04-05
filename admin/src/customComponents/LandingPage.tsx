import { useBuildModeController } from "@firecms/core";
import { Brightness5Icon, DarkModeIcon } from "@firecms/ui";
import React from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const modeController = useBuildModeController();

  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center p-4 min-h-screen overflow-hidden">
      <div className="absolute top-1 -right-1">
        <button
          className="btn btn-ghost tooltip tooltip-bottom"
          data-tip="Toggle Mode"
          onClick={() => modeController.toggleMode()}
        >
          {modeController.mode === "dark" ? (
            <DarkModeIcon />
          ) : (
            <Brightness5Icon />
          )}
        </button>
      </div>
      <h1>Welcome to the landing page</h1>
      <p className="text-center mt-4">
        This is a custom landing page. Information about the System will be
        shown here
      </p>

      <button className="btn mt-4" onClick={() => navigate("/app")}>
        Proceed
      </button>
    </div>
  );
}
