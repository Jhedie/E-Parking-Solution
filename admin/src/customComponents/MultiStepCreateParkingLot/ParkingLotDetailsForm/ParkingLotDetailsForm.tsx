import { FieldArray, useFormikContext } from "formik";
import React from "react";
import { z } from "zod";
export const OperatingHourSchema = z.object({
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
});

export const ParkingLotDetailsFormSchema = z.object({
  LotName: z.string().min(5, "Lot Name is required"),
  Description: z.string().min(10, "Description is required").max(350),
  OperatingHours: z
    .array(OperatingHourSchema)
    .min(1, "At least one Operating Hour is required"),
  Facilities: z.array(z.string()),
  Facility: z.string().optional(),
  Images: z.array(z.string()),
});

export default function ParkingLotDetailsForm() {
  const formikProps =
    useFormikContext<z.infer<typeof ParkingLotDetailsFormSchema>>();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">Parking Lot Details</h2>
      <div className="text-lg mb-4">
        Here you can add details about your parking lot like the name,
        description, facilities, and operating hours.
      </div>
      <div className="flex flex-col justify-between">
        <label className="flex items-center m-5">
          <input
            type="text"
            name="LotName"
            placeholder="Lot Name"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.LotName}
            className={`w-full input input-bordered bg-white p-3 ${
              formikProps.touched.LotName && formikProps.errors.LotName
                ? "border-red-500"
                : ""
            }`}
          />
          {formikProps.touched.LotName && formikProps.errors.LotName && (
            <div
              className="tooltip tooltip-open tooltip-warning tooltip-right"
              data-tip={formikProps.errors.LotName}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 text-red-500 ml-auto"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </label>

        <div className="flex justify-between m-5">
          <label className="flex-1">
            <input
              type="text"
              name="Facility"
              placeholder="EV Charging, Disabled Access, Bicycle Parking, Security Cameras, Motorcycle Parking..."
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              value={formikProps.values.Facility}
              className="input input-bordered bg-white p-3 w-full"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (
                formikProps.values.Facility &&
                !formikProps.values.Facilities.includes(
                  formikProps.values.Facility
                ) &&
                formikProps.values.Facilities.length < 9
              ) {
                formikProps.setFieldValue("Facilities", [
                  ...formikProps.values.Facilities,
                  formikProps.values.Facility,
                ]);
                formikProps.setFieldValue("Facility", "");
              }
            }}
            className="btn btn-primary ml-2"
            disabled={
              formikProps.values.Facilities.length >= 10 ||
              !formikProps.values.Facility
            }
          >
            Add Facility
          </button>
        </div>
        <div className="flex items-center mx-5">
          {formikProps.values.Facilities.map((facility, index) => (
            <div key={index} className="flex items-center mx-2">
              <span className="p-2">{facility}</span>
              <button
                type="button"
                onClick={() => {
                  const newFacilities = formikProps.values.Facilities.filter(
                    (f) => f !== facility
                  );
                  formikProps.setFieldValue("Facilities", newFacilities);
                }}
                className="btn btn-warning btn-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center m-5">
          <textarea
            name="Description"
            placeholder="Description..."
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Description}
            maxLength={350}
            className={`input input-bordered bg-white p-3 resize-none h-32 w-full ${
              formikProps.touched.Description && formikProps.errors.Description
                ? "border-red-500"
                : ""
            }`}
          />
          {formikProps.touched.Description &&
            formikProps.errors.Description && (
              <div
                className="tooltip tooltip-open tooltip-warning tooltip-right"
                data-tip={formikProps.errors.Description}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-red-500 ml-auto"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-2 0v3a1 1 0 002 0V6zm-1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
        </label>

        {/* Operating Hours FieldArray */}
        <div className="flex flex-col justify-center space-y-4 p-5">
          <div className="text-lg font-semibold">Operating Hours</div>
          <FieldArray name="OperatingHours">
            {({ remove, push }) => (
              <div>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    className="btn btn-secondary btn-outline m-1 "
                    onClick={() => {
                      if (
                        !formikProps.values.OperatingHours.some(
                          (hour) => hour.day === day
                        )
                      ) {
                        push({ day, start: "00:00", end: "23:59" });
                      }
                    }}
                    disabled={formikProps.values.OperatingHours.some(
                      (hour) => hour.day === day
                    )} //if day is already in the array, disable the button
                  >
                    Add {day}
                  </button>
                ))}
                {formikProps.values.OperatingHours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center
                     m-2"
                  >
                    <span className="mr-2">{hour.day}:</span>
                    <input
                      type="time"
                      name={`OperatingHours[${index}].start`}
                      onChange={formikProps.handleChange}
                      value={hour.start}
                      className="input input-bordered mr-2 bg-white"
                    />
                    <input
                      type="time"
                      name={`OperatingHours[${index}].end`}
                      onChange={formikProps.handleChange}
                      value={hour.end}
                      className="input input-bordered mr-2 bg-white"
                    />
                    <button
                      type="button"
                      className="btn btn-warning btn-xs"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
        </div>
        {formikProps.touched.OperatingHours &&
        formikProps.errors.OperatingHours ? (
          <div className="text-red-500 ml-5">
            {/* It can be an array of errors or a single error */}
            {Array.isArray(formikProps.errors.OperatingHours) ? (
              formikProps.errors.OperatingHours.map((error, index) => (
                <div key={index}>{Object.values(error).join(", ")}</div>
              ))
            ) : (
              <div>{formikProps.errors.OperatingHours}</div>
            )}
          </div>
        ) : null}

        {/* Image Upload */}
        <div className="flex flex-col justify-center space-y-4 p-5">
          <label className="text-lg font-semibold">Upload Images</label>
          <label className="mb-2">
            <input
              type="file"
              name="Images"
              multiple
              onChange={(event) => {
                if (event.target.files) {
                  const files = Array.from(event.target.files);
                  // Mapping through the files array to create an array of URLs
                  const urls = files.map((file) => URL.createObjectURL(file));
                  // Updating the images array with the new URLs
                  formikProps.setFieldValue("Images", [
                    ...formikProps.values.Images,
                    ...urls,
                  ]);
                }
              }}
              className="file-input max-w-xs"
            />
          </label>
          {/* Container for displaying uploaded images */}
          <div className="flex flex-wrap">
            {/* Mapping through images array to display each uploaded image */}
            {/* Individual image container */}
            {formikProps.values.Images.map((image, index) => (
              <div key={index} className="m-2">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-24 h-24 object-cover"
                />
                {/* Button to remove the image */}
                <button
                  type="button"
                  className="btn btn-warning btn-xs mt-2"
                  onClick={() => {
                    // Filtering out the image to be removed
                    const newImages = formikProps.values.Images.filter(
                      (_, imgIndex) => imgIndex !== index
                    );
                    // Updating the images array after removal
                    formikProps.setFieldValue("images", newImages);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
