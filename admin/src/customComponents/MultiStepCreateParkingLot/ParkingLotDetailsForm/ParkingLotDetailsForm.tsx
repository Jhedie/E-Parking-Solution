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
  lotName: z.string().min(5, "Lot Name is required"),
  description: z.string().min(1, "Description is required").max(250),
  operatingHours: z
    .array(OperatingHourSchema)
    .min(1, "Operating Hours is required"),
  facilities: z.array(z.string()).min(1, "Facilities is required"),
  facility: z.string(),
  images: z.array(z.string()),
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
            name="lotName"
            placeholder="Lot Name"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.lotName}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <div className="flex justify-between m-5">
          <label className="flex-1">
            <input
              type="text"
              name="facility"
              placeholder="EV Charging, Disabled Access, Bicycle Parking, Security Cameras, Motorcycle Parking..."
              onChange={formikProps.handleChange}
              onBlur={formikProps.handleBlur}
              value={formikProps.values.facility}
              className="input input-bordered bg-white p-3 w-full"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              if (
                formikProps.values.facility &&
                !formikProps.values.facilities.includes(
                  formikProps.values.facility
                ) &&
                formikProps.values.facilities.length < 9
              ) {
                formikProps.setFieldValue("facilities", [
                  ...formikProps.values.facilities,
                  formikProps.values.facility,
                ]);
                formikProps.setFieldValue("facility", "");
              }
            }}
            className="btn btn-primary ml-2"
            disabled={
              formikProps.values.facilities.length >= 10 ||
              !formikProps.values.facility
            }
          >
            Add Facility
          </button>
        </div>
        <div className="flex items-center mx-5">
          {formikProps.values.facilities.map((facility, index) => (
            <div key={index} className="flex items-center mx-2">
              <span className="p-2">{facility}</span>
              <button
                type="button"
                onClick={() => {
                  const newFacilities = formikProps.values.facilities.filter(
                    (f) => f !== facility
                  );
                  formikProps.setFieldValue("facilities", newFacilities);
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
            name="description"
            placeholder="Description..."
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.description}
            maxLength={250}
            className="input input-bordered bg-white p-3 resize-none h-32 w-full"
          />
        </label>

        {/* Operating Hours FieldArray */}
        <div className="flex flex-col justify-center space-y-4 p-5">
          <div className="text-lg font-semibold">Operating Hours</div>
          <FieldArray name="operatingHours">
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
                        !formikProps.values.operatingHours.some(
                          (hour) => hour.day === day
                        )
                      ) {
                        push({ day, start: "00:00", end: "23:59" });
                      }
                    }}
                    disabled={formikProps.values.operatingHours.some(
                      (hour) => hour.day === day
                    )} //if day is already in the array, disable the button
                  >
                    Add {day}
                  </button>
                ))}
                {formikProps.values.operatingHours.map((hour, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center
                     m-2"
                  >
                    <span className="mr-2">{hour.day}:</span>
                    <input
                      type="time"
                      name={`operatingHours[${index}].start`}
                      onChange={formikProps.handleChange}
                      value={hour.start}
                      className="input input-bordered mr-2 bg-white"
                    />
                    <input
                      type="time"
                      name={`operatingHours[${index}].end`}
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

        {/* Image Upload */}
        <div className="flex flex-col justify-center space-y-4 p-5">
          <label className="text-lg font-semibold">Upload Images</label>
          <label className="mb-2">
            <input
              type="file"
              name="images"
              multiple
              onChange={(event) => {
                if (event.target.files) {
                  const files = Array.from(event.target.files);
                  const urls = files.map((file) => URL.createObjectURL(file));
                  formikProps.setFieldValue("images", [
                    ...formikProps.values.images,
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
            {formikProps.values.images.map((image, index) => (
              <div key={index} className="m-2">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-24 h-24 object-cover"
                />

                <button
                  type="button"
                  className="btn btn-error btn-xs mt-2"
                  onClick={() => {
                    // Filtering out the image to be removed
                    const newImages = formikProps.values.images.filter(
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
