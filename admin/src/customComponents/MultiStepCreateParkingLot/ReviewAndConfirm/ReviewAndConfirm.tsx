import { useModeController } from "@firecms/core";
import { useFormikContext } from "formik";
import React from "react";
import { ComprehensiveFormValues } from "../MultiStepCreateParkingLotForm";

export default function ReviewAndConfirm() {
  const { values } = useFormikContext<ComprehensiveFormValues>();
  const modeState = useModeController();

  return (
    <div className={"space-y-4 rounded-lg"}>
      <h2 className="text-lg font-semibold mb-4">Review and Confirm</h2>
      <div className="text-lg mb-4">
        Please review the details you have entered for your parking lot. If
        everything looks good, click the &quot;Submit&quot; button to create
        your parking lot.
      </div>
      {values && (
        <div className="space-y-4">
          <div
            className={`card shadow-xl p-4 ${
              modeState.mode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h3 className="font-semibold">Parking Lot Details</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Lot Name:</span>{" "}
                {values.LotName}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {values.Description}
              </p>
              <p>
                <span className="font-semibold">Facilities:</span>{" "}
                {values.Facilities.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Operating Hours:</span>
              </p>
              <ul>
                {values.OperatingHours.map((hour, index) => (
                  <li
                    key={index}
                  >{`${hour.day}: ${hour.start} - ${hour.end}`}</li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className={`card shadow-xl p-4 ${
              modeState.mode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h3 className="font-semibold">Parking Lot Address</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Street Number:</span>{" "}
                {values.Address.streetNumber}
              </p>
              <p>
                <span className="font-semibold">Unit Number:</span>{" "}
                {values.Address.unitNumber}
              </p>
              <p>
                <span className="font-semibold">Street Name:</span>{" "}
                {values.Address.streetName}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {values.Address.city}
              </p>
              <p>
                <span className="font-semibold">State:</span>{" "}
                {values.Address.state}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {values.Address.country}
              </p>
              <p>
                <span className="font-semibold">Postal Code:</span>{" "}
                {values.Address.postalCode}
              </p>
              <p>
                <span className="font-semibold">Coordinates:</span> Latitude{" "}
                {values.Coordinates?.Latitude}, Longitude{" "}
                {values.Coordinates?.Longitude}
              </p>
            </div>
          </div>
          <div
            className={`card shadow-xl p-4 ${
              modeState.mode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h3 className="font-semibold">Parking Slots Configuration</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Capacity:</span>{" "}
                {values.Capacity}
              </p>
              <p>
                <span className="font-semibold">Slots Configuration:</span>
              </p>
              <ul>
                {values.SlotsConfig.map((slot, index) => (
                  <li
                    key={index}
                  >{`Row ${slot.row}, Columns: ${slot.columns}`}</li>
                ))}
              </ul>
              <p>
                <span className="font-semibold">Disabled Slots:</span>{" "}
                {values.SlotTypes.disabled
                  ? values.SlotTypes.disabled
                  : "No disabled slots added"}
              </p>
              <p>
                <span className="font-semibold">Electric Slots:</span>{" "}
                {values.SlotTypes.electric
                  ? values.SlotTypes.electric
                  : "No electric slots added"}
              </p>
            </div>
          </div>
          <div
            className={`card shadow-xl p-4 ${
              modeState.mode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h3 className="font-semibold">Parking Rates</h3>
            <div className="card-body">
              <ul>
                {values.Rates.length === 0 ? (
                  <li>No rates added</li>
                ) : (
                  values.Rates.map((rate, index) => (
                    <li
                      key={index}
                    >{`Type: ${rate.rateType}, Rate: ${rate.rate}, Duration: ${rate.duration}`}</li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div
            className={`card shadow-xl p-4 ${
              modeState.mode === "dark" ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h3 className="font-semibold">Images</h3>
            <div className="card-body">
              <ul>
                {values.Images.length === 0 ? (
                  <li>No images uploaded</li>
                ) : (
                  values.Images.map((image, index) => (
                    <li
                      key={index}
                      className="flex justify-center items-center mb-2 "
                    >
                      <img src={image} alt={`Image ${index}`} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
