import { useFormikContext } from "formik";
import { ComprehensiveFormValues } from "../MultiStepCreateParkingLotForm";

export default function ReviewAndConfirm() {
  const { values } = useFormikContext<ComprehensiveFormValues>();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Review and Confirm</h2>
      <div className="text-lg mb-4">
        Please review the details you have entered for your parking lot. If
        everything looks good, click the &quot;Submit&quot; button to create
        your parking lot.
      </div>
      {values && (
        <div className="space-y-4">
          <div className="card bg-white shadow-xl p-4">
            <h3 className="font-semibold">Parking Lot Details</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Lot Name:</span>{" "}
                {values.lotName}
              </p>
              <p>
                <span className="font-semibold">Description:</span>{" "}
                {values.description}
              </p>
              <p>
                <span className="font-semibold">Facilities:</span>{" "}
                {values.facilities.join(", ")}
              </p>
              <p>
                <span className="font-semibold">Operating Hours:</span>
              </p>
              <ul>
                {values.operatingHours.map((hour, index) => (
                  <li
                    key={index}
                  >{`${hour.day}: ${hour.start} - ${hour.end}`}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card bg-white shadow-xl p-4">
            <h3 className="font-semibold">Parking Lot Address</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Street Number:</span>{" "}
                {values.address.streetNumber}
              </p>
              <p>
                <span className="font-semibold">Unit Number:</span>{" "}
                {values.address.unitNumber}
              </p>
              <p>
                <span className="font-semibold">Street Name:</span>{" "}
                {values.address.streetName}
              </p>
              <p>
                <span className="font-semibold">City:</span>{" "}
                {values.address.city}
              </p>
              <p>
                <span className="font-semibold">State:</span>{" "}
                {values.address.state}
              </p>
              <p>
                <span className="font-semibold">Country:</span>{" "}
                {values.address.country}
              </p>
              <p>
                <span className="font-semibold">Postal Code:</span>{" "}
                {values.address.postalCode}
              </p>
              <p>
                <span className="font-semibold">Coordinates:</span> Latitude{" "}
                {values.address.coordinates?.latitute}, Longitude{" "}
                {values.address.coordinates?.longitude}
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-xl p-4">
            <h3 className="font-semibold">Parking Slots Configuration</h3>
            <div className="card-body">
              <p>
                <span className="font-semibold">Capacity:</span>{" "}
                {values.capacity}
              </p>
              <p>
                <span className="font-semibold">Slots Configuration:</span>
              </p>
              <ul>
                {values.slotsConfig.map((slot, index) => (
                  <li
                    key={index}
                  >{`Row ${slot.row}, Columns: ${slot.columns}`}</li>
                ))}
              </ul>
              <p>
                <span className="font-semibold">Handicapped Slots:</span>{" "}
                {values.slotTypes.handicapped
                  ? values.slotTypes.handicapped
                  : "No handicapped slots added"}
              </p>
              <p>
                <span className="font-semibold">Electric Slots:</span>{" "}
                {values.slotTypes.electric
                  ? values.slotTypes.electric
                  : "No electric slots added"}
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-xl p-4">
            <h3 className="font-semibold">Parking Rates</h3>
            <div className="card-body">
              <ul>
                {values.rates.length === 0 ? (
                  <li>No rates added</li>
                ) : (
                  values.rates.map((rate, index) => (
                    <li
                      key={index}
                    >{`Type: ${rate.rateType}, Rate: ${rate.rate}, Duration: ${rate.duration}`}</li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <div className="card bg-white shadow-xl p-4">
            <h3 className="font-semibold">Images</h3>
            <div className="card-body">
              <ul>
                {values.images.length === 0 ? (
                  <li>No images uploaded</li>
                ) : (
                  values.images.map((image, index) => (
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
