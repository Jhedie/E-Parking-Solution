import { useBuildModeController } from "@firecms/core";
import {
  AndroidIcon,
  AppsIcon,
  Brightness5Icon,
  DarkModeIcon,
} from "@firecms/ui";
import React from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const modeController = useBuildModeController();
  const navigate = useNavigate();
  const [showBarcodes, setShowBarcodes] = React.useState(false);

  const toggleQRCode = () => {
    setShowBarcodes(!showBarcodes);
  };

  return (
    <div className="flex flex-row h-screen">
      {/* Mode Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => modeController.toggleMode()}
          title="Toggle Dark/Light Mode"
        >
          {modeController.mode === "dark" ? (
            <Brightness5Icon />
          ) : (
            <DarkModeIcon />
          )}
        </button>
      </div>

      {/* Parking User Section */}
      <div
        className={`flex-1 overflow-hidden flex flex-col ${
          modeController.mode === "dark" ? "text-white" : "text-black"
        } pt-16`}
      >
        <h2 className="text-4xl font-bold text-center">Find Your Spot</h2>
        <p className="text-xl mb-8 text-center">
          Discover the best parking spots near you with ease.
        </p>
        <button
          className={`btn bg-white ${
            modeController.mode === "dark" ? "text-black" : "text-black"
          } font-bold py-2 px-4 rounded hover:bg-gray-100 w-1/2 self-center`}
          onClick={toggleQRCode}
        >
          Start Parking
        </button>
        {/* Single Mobile M/Users/jhedie/Downloads/parkingMap.jpegkup */}
        {!showBarcodes ? (
          <div className="flex justify-center items-center scale-75">
            <div className="mockup-phone">
              <div className="camera bg-black"></div>
              <div className="display bg-white">
                <div className="artboard artboard-demo phone-4">
                  <div>
                    <img
                      src="../../public/slotsDashboardImage.jpeg"
                      alt="Parking App"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mockup-phone">
              <div className="camera bg-black"></div>
              <div className="display bg-white">
                <div className="artboard artboard-demo phone-4">
                  <div>
                    <img src="/public/parkingMap.jpeg" alt="Parking App" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center  scale-75">
            <img src="/public/qr_code_ios_download.png" alt="Barcode" />
          </div>
        )}
      </div>

      {/* Parking Owner Section */}
      <div className="flex-none sticky top-0 flex flex-col items-center justify-center bg-primary text-white p-10">
        <h2 className="text-4xl text-black font-bold mb-6">Manage Your Lot</h2>
        <p className="text-xl text-black mb-8">
          Control your parking spaces and maximize your earnings.
        </p>
        <button
          className="btn bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-100"
          onClick={() => navigate("/app")}
        >
          Owner Dashboard
        </button>
      </div>
    </div>
  );
}
