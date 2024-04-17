import { Loader } from "@googlemaps/js-api-loader";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { z } from "zod";
export const ParkingLotAddressFormSchema = z.object({
  Address: z.object({
    streetNumber: z.string().optional(),
    unitNumber: z.string().optional(),
    streetName: z.string().min(1, "Street Name is required"),
    city: z.string().min(1, "City is required"),
    state: z.string(),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal Code is required"),
    formattedAddress: z.string().optional(),
  }),
  Coordinates: z
    .object({
      Latitude: z.number(),
      Longitude: z.number(),
    })
    .optional(),
});

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const loader = new Loader({
  apiKey: API_KEY,
  version: "weekly",
  libraries: ["places"],
});
export default function ParkingLotAddressForm() {
  const formikProps =
    useFormikContext<z.infer<typeof ParkingLotAddressFormSchema>>();

  const [placeSelected, setPlaceSelected] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [locationSearch, setLocationSearch] = useState<string | "">("");

  function savePlaceDetailsToState(
    placeDetails: google.maps.places.PlaceResult | null
  ): void {
    setPlaceSelected(placeDetails);
  }

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesService({
    apiKey: loader.apiKey,
  });

  useEffect(() => {
    // fetch place details for the first element in placePredictions array
    if (placePredictions.length)
      placesService?.getDetails(
        {
          placeId: placePredictions[0].place_id,
        },
        (placeDetails: google.maps.places.PlaceResult | null) => {
          savePlaceDetailsToState(placeDetails);
        }
      );
  }, [placesService, placePredictions]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Parking Address</h2>
      <div className="text-lg mb-4">
        Enter your address to see the drop down and choose your desired address
      </div>
      <div className="flex w-full mb-4">
        <label className="w-full my-0 py-0 flex-1">
          <input
            type="text"
            name="locationSearch"
            placeholder="Search for a location"
            value={locationSearch}
            onChange={(e) => {
              setLocationSearch(e.target.value);
              getPlacePredictions({ input: e.target.value });
            }}
            onBlur={formikProps.handleBlur}
            className="input input-bordered bg-white w-full"
          />

          {!isPlacePredictionsLoading && locationSearch !== "" && (
            <div className="mt-5 w-50 h-50 flex flex-col mb-25">
              {placePredictions.map((item) => (
                <div
                  key={item.place_id}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => {
                    setLocationSearch(item.description);
                  }}
                >
                  {item.description}
                </div>
              ))}
            </div>
          )}
        </label>
        <div className="flex-none ml-4">
          <button
            type="button" // Ensure the button does not submit a form unintentionally
            className="btn btn-primary"
            disabled={locationSearch === ""}
            onClick={(e) => {
              e.preventDefault(); // Prevent default action that might cause navigation

              console.log(placeSelected);

              formikProps.setFieldValue(
                "Address.formattedAddress",
                placeSelected?.formatted_address
              );
              placeSelected?.address_components?.forEach((component) => {
                const type = component.types[0];
                switch (type) {
                  case "street_number":
                    formikProps.setFieldValue(
                      "Address.streetNumber",
                      component.long_name
                    );
                    break;
                  case "premise": {
                    const currentAddressName =
                      formikProps.values.Address.unitNumber;
                    formikProps.setFieldValue(
                      "Address.unitNumber",
                      currentAddressName === ""
                        ? component.long_name
                        : `${component.long_name}, ${currentAddressName}`
                    );
                    break;
                  }
                  case "route":
                    formikProps.setFieldValue(
                      "Address.streetName",
                      component.long_name
                    );
                    break;
                  case "postal_town":
                    formikProps.setFieldValue(
                      "Address.city",
                      component.long_name
                    );
                    break;
                  case "administrative_area_level_2": {
                    const currentCity = formikProps.values.Address.city;
                    if (
                      currentCity === "" &&
                      component.long_name === "Greater London"
                    ) {
                      formikProps.setFieldValue("Address.city", "London");
                    } else {
                      formikProps.setFieldValue(
                        "Address.city",
                        component.long_name
                      );
                    }
                    break;
                  }
                  case "neighborhood":
                    if (formikProps.values.Address.city === "")
                      formikProps.setFieldValue(
                        "Address.city",
                        component.long_name
                      );
                    break;
                  case "country":
                    formikProps.setFieldValue(
                      "Address.country",
                      component.long_name
                    );
                    break;
                  case "postal_code":
                    formikProps.setFieldValue(
                      "Address.postalCode",
                      component.long_name
                    );
                    break;
                  default:
                    break;
                }
              });

              const coordinates = placeSelected?.geometry?.location;
              // Set the formik values for latitude and longitude to be used later
              if (coordinates) {
                formikProps.setFieldValue(
                  "Coordinates.Latitude",
                  coordinates.lat()
                );
                formikProps.setFieldValue(
                  "Coordinates.Longitude",
                  coordinates.lng()
                );
              }
              setLocationSearch("");
            }}
          >
            Fill Address
          </button>
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.streetNumber"
            placeholder="Street Number"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.streetNumber}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.unitNumber"
            placeholder="Unit Number"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.unitNumber}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.streetName"
            placeholder="Street Name"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.streetName}
            className={`w-full input input-bordered bg-white p-3 ${
              formikProps.touched.Address && formikProps.errors.Address
                ? "border-red-500"
                : ""
            }`}
          />
          {formikProps.values.Address &&
            formikProps.touched.Address &&
            formikProps.errors.Address && (
              <div
                className="tooltip tooltip-open tooltip-warning"
                data-tip={formikProps.errors.Address}
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

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.city"
            placeholder="City"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.city}
            className={`w-full input input-bordered bg-white p-3 ${
              formikProps.touched.Address && formikProps.errors.Address
                ? "border-red-500"
                : ""
            }`}
          />
          {formikProps.values.Address &&
            formikProps.touched.Address &&
            formikProps.errors.Address && (
              <div
                className="tooltip tooltip-open tooltip-warning"
                data-tip={formikProps.errors.Address}
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

        {/* state */}
        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.state"
            placeholder="State"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.state}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>

        <label className="flex items-center mb-4">
          <input
            type="text"
            name="Address.postalCode"
            placeholder="Postal Code"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.postalCode}
            className={`w-full input input-bordered bg-white p-3 ${
              formikProps.touched.Address && formikProps.errors.Address
                ? "border-red-500"
                : ""
            }`}
            aria-describedby="postalCodeError"
          />
          {formikProps.values.Address &&
            formikProps.touched.Address &&
            formikProps.errors.Address && (
              <div
                className="tooltip tooltip-open tooltip-warning"
                data-tip={formikProps.errors.Address}
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

        <label className="flex items-center">
          <input
            type="text"
            name="Address.country"
            placeholder="Country"
            onChange={formikProps.handleChange}
            onBlur={formikProps.handleBlur}
            value={formikProps.values.Address.country}
            className="w-full input input-bordered bg-white p-3"
          />
        </label>
      </div>
    </div>
  );
}
